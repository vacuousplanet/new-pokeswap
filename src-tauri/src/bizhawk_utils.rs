use std::net::Ipv4Addr;
use std::net::SocketAddrV4;

use tokio::net::TcpListener;
use tokio::{
  io::{AsyncReadExt, AsyncWriteExt},
  sync::mpsc,
};

use defer_lite::defer;

#[derive(Debug)]
enum Listener {
  Msg,
  Leave,
}

#[tauri::command]
pub async fn run_bizhawk(window: tauri::Window, biz_path: String, game_path: String, savestate_path: Option<String>) {

  println!("starting listener");

  let socket_addr = SocketAddrV4::new(Ipv4Addr::new(127, 0, 0, 1), 2525);

  // start server
  let listener = match TcpListener::bind(socket_addr).await {
    Err(err) => {println!("onbind: {}", err.to_string()); panic!();},
    Ok(s) => s,
  };

  // start bizhawk
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

  // basically window handlers for injecting into tokio server loop 
  let (tx, mut rx) = mpsc::channel::<(Listener, tauri::Event)>(1);
  let event_sender = tx.clone();
  let leave_sender = tx.clone();

  println!("event senders cloned");

  // TODO: more ideomatic/programmatic way of doing this...
  //       loop through listener enum values and have a map to string vals?
  let event = window.listen("FRONTEND_MSG", move |e| {
    event_sender.try_send((Listener::Msg, e)).unwrap();
  });

  let leave_ev = window.listen("LEAVE", move |e| {
    leave_sender.try_send((Listener::Leave, e)).unwrap();
  });

  defer! {
    window.unlisten(event);
    window.unlisten(leave_ev);
    println!("Listeners unbound from window!");
  }
  
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
        
        // if we wanted to do some message parsing here, this is where that would happen

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

}
