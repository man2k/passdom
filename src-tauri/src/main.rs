// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};
use hex_literal::hex;
use rand::Rng;
use hex::encode;
extern crate buffer;
// use std::io::Write;
// use std::fmt::Write;

// use core::slice::SlicePattern;
use std::io::prelude::*;
use buffer::ReadBuffer;
// use std::any::type_name;
use std::env;
// use std::error::Error;
// use std::fs;
use std::fs::File;
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
async fn encryptfile(file_path: String) {
    println!("path: {}", file_path);
    let path = Path::new(&file_path);
    let display = path.display();

    // Open the path in read-only mode, returns `io::Result<File>`
    let mut file = match File::open(&path) {
        Err(why) => panic!("couldn't open {}: {}", display, why),
        Ok(file) => file,
    };
    let mut contents = Vec::new();
    file.read_to_end(&mut contents);

    // println!("File contents: {:?}", contents);

    // let iv = hex!("f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff");
    // rand::thread_rng().fill(&mut iv); 
    // let mut mykey = String::from("000102030405060708090A0B0C0D0E0F");
    // let mut mykey = [0u8; 16]; 
    // rand::thread_rng().fill(&mut mykey);
    let iv = rand::thread_rng().gen::<[u8; 16]>();
    let key =  rand::thread_rng().gen::<[u8; 16]>();
    // let hex_key = encode(mykey); 

    println!("Key: {}", encode(key));
    println!("IV: {}", encode(iv));


    // let key = hex::decode(hex_key).expect("Decoding failed");

    let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();

    let pos = contents.len();
    println!("pos : {}" , pos);

    // let mut buffer = [0u8; 1000000];
    let mut buffer: Vec<u8> = vec![0u8; pos+100]; 
    // println!("buf: {:?}", buffer.len());


    buffer[..pos].copy_from_slice(&contents);
    // println!("buf: {:?}", buffer);

    let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();

    let mut fil = File::create(r"C:\Users\manis\Desktop\encypted.enc").expect("something");
    fil.write_all(ciphertext).expect("something");

    // println!("\nCiphertext: {:?}", hex::encode(ciphertext));
    // println!("\nCiphertext: {:?}", ciphertext);

    // Decrypt Code
    let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();
    let mut buf = ciphertext.to_vec();
    let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();
    let mut fil = File::create(r"C:\Users\manis\Desktop\l.txt").expect("something");
    fil.write_all(decrypted_ciphertext).expect("something");
    println!("\nDecrypted: {:?}", decrypted_ciphertext);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, encryptfile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
