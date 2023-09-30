// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// TODO: move this to separate file
#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Utf8(#[from] std::str::Utf8Error)
}

impl serde::Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

use std::io::Read;
use std::io::Seek;
use std::net::Ipv4Addr;
use std::net::SocketAddrV4;

#[tauri::command]
fn read_file(path: &str, offset: u64, length: usize) -> Result<String, Error> {
    // there are more checks I could do, but for now just check game-version in header
    let mut buf: Vec<u8> = vec![0; length];
    let mut f = std::fs::File::open(path)?;
    f.seek(std::io::SeekFrom::Start(offset))?;
    f.read_exact(&mut buf)?;

    // ok so the utf err handling here is mondo jank lol, but the enum/thiserror approach
    // didn't work as expected
    // tl;dr, this could probably be better 
    Ok(match std::str::from_utf8(&buf) {
        Err(_) => String::from("UTF_ERR"),
        Ok(s) => s.to_owned(),
    })
}

use tokio::net::TcpListener;
use tokio::{
  io::{AsyncReadExt, AsyncWriteExt},
  sync::mpsc,
};

#[derive(Debug)]
enum Listener {
  Msg,
  Leave,
}

#[tauri::command]
async fn run_bizhawk(window: tauri::Window, biz_path: String, lua_path: String, game_path: String, savestate_path: Option<String>) {

  println!("starting listener");

  let socket_addr = SocketAddrV4::new(Ipv4Addr::new(127, 0, 0, 1), 2525);

  let listener = match TcpListener::bind(socket_addr).await {
    Err(err) => {println!("onbind: {}", err.to_string()); panic!();},
    Ok(s) => s,
  };

  let _ = std::process::Command::new(biz_path)
    .arg("--socket_ip=127.0.0.1")
    .arg(format!("--socket_port={}", socket_addr.port()))
    .arg(game_path)
    .stdout(std::process::Stdio::piped())
    .spawn()
    .expect("Failed to start Bizhawk process");

  println!("starting socket");

  // TODO: actually handle error in socket connection! 
  let mut socket = match listener.accept().await {
    Err(err) => {println!("{}", err.to_string()); panic!();},
    Ok((s, _addr)) => s,
  };
  
  println!("socket started");
  
  let (tx, mut rx) = mpsc::channel::<(Listener, tauri::Event)>(1);
  let event_sender = tx.clone();
  let leave_sender = tx.clone();

  println!("event senders cloned");

  let event = window.listen("FRONTEND_MSG", move |e| {
    event_sender.try_send((Listener::Msg, e)).unwrap();
  });

  let leave_ev = window.listen("LEAVE", move |e| {
    leave_sender.try_send((Listener::Leave, e)).unwrap();
  });

  // lol
  let mut buf = vec![0; 2048];

  loop {
    tokio::select! {
      // read from Lua process, send to front end!
      result = socket.read(&mut buf) => {
        let buf_len = match result {
          Err(_) => { break; },
          Ok(n) if n == 0 => {
            break;
          }
          Ok(n) => n,
        };

        buf.resize(buf_len, 0);

        let data_str = String::from_utf8_lossy(&buf);

        window.emit("LUA_MSG", data_str).unwrap();
      }

      // read from front end, send to lua
      payload = rx.recv() => {
        match payload {
          Some((Listener::Msg, data)) => {
            match socket.write(data.payload().unwrap().as_bytes()).await {
              Err(_) => panic!(),
              Ok(_) => ()
            }
          },
          Some((Listener::Leave, _)) => {
            println!("Closing server!");
            break;
          },
          None => ()
        }
      }
    }

    buf = vec![0; 1024];
  }

  window.unlisten(event);
  window.unlisten(leave_ev);

  println!("Listeners unbound from window!");

}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
          read_file,
          run_bizhawk
        ])
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
