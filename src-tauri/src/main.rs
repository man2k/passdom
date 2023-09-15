// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::env;
mod commands;
mod utilities;
use commands::decryptfile::decryptfile;
use commands::decrypttext::decrypttext;
use commands::desteganograph::desteganograph;
use commands::encryptfile::encryptfile;
use commands::encrypttext::encrypttext;
use commands::steganograph::steganograph;
use utilities::showinfolder;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            encryptfile,
            decryptfile,
            showinfolder,
            encrypttext,
            decrypttext,
            steganograph,
            desteganograph
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
