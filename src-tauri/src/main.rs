// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs::File;
use std::path::Path;
use std::env;
use std::str;
use std::io::prelude::*;
use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};
use rand::Rng;
use hex::encode;
use std::any::type_name;
use dirs;
use std::process::Command;


type Aes128Cbc = Cbc<Aes128, Pkcs7>;
type Aes256Cbc = Cbc<Aes256, Pkcs7>;
type Aes192Cbc = Cbc<Aes192, Pkcs7>;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn type_of<T>(_: T) -> &'static str {
    type_name::<T>()
}

#[tauri::command]
async fn decryptfile(file_path: String, file_name: String, key: String) ->  Result<String, String>{
    println!("path: {}", file_path);
    let path = Path::new(&file_path);
    let display = path.display();

    let mut file = match File::open(&path) {
        Err(why) => panic!("couldn't open {}: {}", display, why),
        Ok(file) => file,
    };
    let mut contents = Vec::new();
    let _ = file.read_to_end(&mut contents);

    let (content, iv) = contents.split_at(contents.len()-16);
    let fkey = hex::decode(key).expect("Decoding failed");

    println!("IV: {}", encode(&iv));
    println!("Key: {}", encode(&fkey));

    let cipher = Aes128Cbc::new_from_slices(&fkey,  &iv).unwrap();
    let mut buf = content.to_vec();
    let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();
    let downloads = dirs::download_dir().expect("Could not find downloads directory");
    let finalpath = downloads.join(file_name);
    let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
    fil.write_all(&decrypted_ciphertext).expect("Error Saving Encrypted File");
    Ok("This worked!".into())
}

#[tauri::command]
async fn showinfolder(file_path:String) -> Result<String,()>{
    Command::new("explorer").args(["/select,", &file_path]).spawn()
        .unwrap();
    Ok(format!("Done"))
}

#[tauri::command]
async fn encryptfile(file_path: String, file_name: String) -> Result<String, ()> {
    println!("path: {}", file_path);
    let path = Path::new(&file_path);
    let display = path.display();

    // Open the path in read-only mode, returns `io::Result<File>`
    let mut file = match File::open(&path) {
        Err(why) => panic!("couldn't open {}: {}", display, why),
        Ok(file) => file,
    };
    let mut contents = Vec::new();
    let _ = file.read_to_end(&mut contents);
    // contents.resize(100,0);

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
    println!("Key len: {}", key.len());
    
    println!("IV: {}", encode(iv));
    println!("Iv len: {}", iv.len());
    // println!("type: {}", type_of(&key));
   
    // println!("IV: {:?}", iv);


    // let key = hex::decode(hex_key).expect("Decoding failed");

    let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();

    let pos = contents.len();
    // println!("pos : {}" , pos);

    // let mut buffer = [0u8; 1000000];
    let mut buffer: Vec<u8> = vec![0u8; pos+100]; 
    // println!("buf: {:?}", buffer.len());


    buffer[..pos].copy_from_slice(&contents);
    // println!("buf: {:?}", buffer);

    let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
    let finalchipher = [ciphertext, &iv].concat();
    let downloads = dirs::download_dir().expect("Could not find downloads directory");
    let finalpath = downloads.join(file_name);
    // println!("type chi: {}", type_of(ciphertext));
    // println!("type chi: {:?}", ciphertext);
    // println!("type chi: {:?}", finalChipher);
    let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
    fil.write_all(&finalchipher).expect("Error Saving Encrypted File");
    Ok(encode(key).into())

    // println!("\nCiphertext: {:?}", hex::encode(ciphertext));
    // println!("\nCiphertext: {:?}", ciphertext);

    // Decrypt Code

    // let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();
    // let mut buf = ciphertext.to_vec();
    // let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();
    // let mut fil = File::create(r"C:\Users\manis\Desktop\l.txt").expect("something");
    // fil.write_all(decrypted_ciphertext).expect("something");
    // println!("\nDecrypted: {:?}", decrypted_ciphertext);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, encryptfile, decryptfile, showinfolder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
