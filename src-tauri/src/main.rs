// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

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

// TODO: start bizhawk coms server in here as well (?)
#[tauri::command]
fn run_bizhawk(biz_path: &str, lua_path: &str, game_path: &str, savestate_path: Option<&str>) {
  let _ = std::process::Command::new(biz_path)
    //.arg("--socket_ip=127.0.0.1")
    //.arg("--socket_port=2525")
    .arg(game_path)
    .stdout(std::process::Stdio::piped())
    .spawn()
    .expect("Failed to start Bizhawk process");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![read_file])
        .invoke_handler(tauri::generate_handler![run_bizhawk])
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
