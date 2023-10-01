// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod error_utils;

pub mod file_utils;
use file_utils::read_file;

pub mod bizhawk_utils;
use bizhawk_utils::run_bizhawk;

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
