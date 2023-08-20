// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};
use hex_literal::hex;
use std::any::type_name;
use std::env;
// use std::error::Error;
// use std::fs;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;
use std::str;

type Aes128Cbc = Cbc<Aes128, Pkcs7>;
type Aes256Cbc = Cbc<Aes256, Pkcs7>;
type Aes192Cbc = Cbc<Aes192, Pkcs7>;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// fn type_of<T>(_: T) -> &'static str {
//     type_name::<T>()
// }

#[tauri::command]
fn encryptfile() {
    let path =
        Path::new(r"M:\pROGRAMMING fILES\DedSec\passdomtauri\passdomNative\src\assets\hey.txt");
    let display = path.display();

    // Open the path in read-only mode, returns `io::Result<File>`
    let mut file = match File::open(&path) {
        Err(why) => panic!("couldn't open {}: {}", display, why),
        Ok(file) => file,
    };
    let mut contents = Vec::new();
    file.read_to_end(&mut contents);

    println!("File contents: {:?}", contents);

    let iv = hex!("f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff");

    // let mut message = String::from("Hello world!");
    let mut mykey = String::from("000102030405060708090A0B0C0D0E0F");

    println!("Key: {}", mykey);
    println!("IV: f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff");

    // let plaintext = message.as_bytes();
    // println!("{}", type_of(&plaintext));

    let key = hex::decode(mykey).expect("Decoding failed");

    let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();

    let pos = contents.len();

    let mut buffer = [0u8; 100000];

    buffer[..pos].copy_from_slice(&contents);

    let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();

    println!("\nCiphertext: {:?}", hex::encode(ciphertext));

    // Decrypt Code
    // let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();
    // let mut buf = ciphertext.to_vec();
    // let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();

    // println!("\nCiphertext: {:?}", decrypted_ciphertext);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, encryptfile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
