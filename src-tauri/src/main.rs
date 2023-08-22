// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// use aes::cipher::generic_array::functional;
use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};
use hex::encode;
use rand::Rng;
use std::env;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;
use std::str;

// use std::any::type_name;
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

// fn type_of<T>(_: T) -> &'static str {
//     type_name::<T>()
// }

#[tauri::command]
async fn decryptfile(
    file_path: String,
    file_name: String,
    key: String,
    algo: usize,
) -> Result<String, String> {
    println!("path: {}", file_path);
    let path = Path::new(&file_path);
    let display = path.display();
    let mut file = match File::open(&path) {
        Err(why) => panic!("couldn't open {}: {}", display, why),
        Ok(file) => file,
    };
    let mut contents = Vec::new();
    let _ = file.read_to_end(&mut contents);

    let (content, iv) = contents.split_at(contents.len() - 16);
    let fkey = hex::decode(key).expect("Decoding failed");
    let mut buf = content.to_vec();

    println!("IV: {}", encode(&iv));
    println!("Key: {}", encode(&fkey));

    if algo == 128 {
        let cipher = Aes128Cbc::new_from_slices(&fkey, &iv).unwrap();
        let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&decrypted_ciphertext)
            .expect("Error Saving Encrypted File");
        Ok("This worked!".into())
    } else if algo == 192 {
        let cipher = Aes192Cbc::new_from_slices(&fkey, &iv).unwrap();
        let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&decrypted_ciphertext)
            .expect("Error Saving Encrypted File");
        Ok("This worked!".into())
    } else if algo == 256 {
        let cipher = Aes256Cbc::new_from_slices(&fkey, &iv).unwrap();
        let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&decrypted_ciphertext)
            .expect("Error Saving Encrypted File");
        Ok("This worked!".into())
    } else {
        Ok("Failed".into())
    }
}

#[tauri::command]
async fn showinfolder(file_name: String) -> Result<String, ()> {
    let downloads = dirs::download_dir().expect("Could not find downloads directory");
    let finalpath = downloads.join(file_name);
    let fp = finalpath.to_str().unwrap();

    println!("save path: {}", fp);
    Command::new("explorer")
        .args(["/select,", fp])
        .spawn()
        .unwrap();
    Ok(format!("Done"))
}

#[tauri::command]
async fn encryptfile(file_path: String, file_name: String, algo: usize) -> Result<String, ()> {
    println!("path: {}", file_path);
    println!("algo: {}", algo);
    let path = Path::new(&file_path);
    let display = path.display();
    let mut file = match File::open(&path) {
        Err(why) => panic!("couldn't open {}: {}", display, why),
        Ok(file) => file,
    };
    let mut contents = Vec::new();
    let _ = file.read_to_end(&mut contents);
    let pos = contents.len();
    println!("pos {}", pos);
    let mut buffer: Vec<u8> = vec![0u8; pos + 100];
    buffer[..pos].copy_from_slice(&contents);
    if algo == 128 {
        let iv = rand::thread_rng().gen::<[u8; 16]>();
        let key = rand::thread_rng().gen::<[u8; 16]>();
        println!("Key: {}", encode(key));
        println!("IV: {}", encode(iv));
        let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
        Ok(encode(key).into())
    } else if algo == 192 {
        let iv = rand::thread_rng().gen::<[u8; 16]>();
        let key = rand::thread_rng().gen::<[u8; 24]>();
        println!("Key: {}", encode(key));
        println!("IV: {}", encode(iv));
        let cipher = Aes192Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
        Ok(encode(key).into())
    } else if algo == 256 {
        let iv = rand::thread_rng().gen::<[u8; 16]>();
        let key = rand::thread_rng().gen::<[u8; 32]>();
        println!("Key: {}", encode(key));
        println!("IV: {}", encode(iv));
        let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
        Ok(encode(key).into())
    } else {
        Ok(format!("failed"))
    }
    // println!("type chi: {}", type_of(ciphertext));
    // println!("type chi: {:?}", ciphertext);
    // println!("type chi: {:?}", finalChipher);

    // println!("\nCiphertext: {:?}", hex::encode(ciphertext));
    // println!("\nCiphertext: {:?}", ciphertext);
}

#[tauri::command]
async fn encrypttext(text_str: String, algo: usize) -> (String, String) {
    println!("encrypt text working...");
    let plaintext = text_str.as_bytes();
    let pos = plaintext.len();
    let mut buffer: Vec<u8> = vec![0u8; pos + 100];
    buffer[..pos].copy_from_slice(&plaintext);
    if algo == 128 {
        let key = rand::thread_rng().gen::<[u8; 16]>();
        let iv = rand::thread_rng().gen::<[u8; 16]>();
        println!("key : {}", encode(&key));
        println!("iv : {}", encode(&iv));
        let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();

        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        println!("finalchipher : {:?}", finalchipher);
        (encode(finalchipher).into(), encode(key).into())
    } else if algo == 192 {
        let key = rand::thread_rng().gen::<[u8; 24]>();
        let iv = rand::thread_rng().gen::<[u8; 16]>();
        println!("key : {}", encode(&key));
        println!("iv : {}", encode(&iv));
        let cipher = Aes192Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        println!("finalchipher : {:?}", finalchipher);
        (encode(finalchipher).into(), encode(key).into())
    } else if algo == 256 {
        let key = rand::thread_rng().gen::<[u8; 32]>();
        let iv = rand::thread_rng().gen::<[u8; 16]>();
        println!("key : {}", encode(&key));
        println!("iv : {}", encode(&iv));
        let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        println!("finalchipher : {:?}", finalchipher);

        (encode(finalchipher).into(), encode(key).into())
    } else {
        ("failed".into(), "failed".into())
    }
}

#[tauri::command]
async fn decrypttext(text: String, key: String, algo: usize) -> Result<String, ()> {
    // let plaintext = text.as_bytes();
    let plaintext = hex::decode(text).expect("Decoding failed");
    println!("plain : {:?}", plaintext);
    let (content, iv) = plaintext.split_at(plaintext.len() - 16);
    println!("content : {:?}", content);
    let fkey = hex::decode(key).expect("Decoding failed");
    let mut buf = content.to_vec();

    println!("key : {}", encode(&fkey));
    println!("iv : {}", encode(&iv));
    if algo == 128 {
        let cipher = Aes128Cbc::new_from_slices(&fkey, &iv).unwrap();
        let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();
        let s = std::str::from_utf8(&decrypted_ciphertext).unwrap();
        Ok(s.to_string())
    } else if algo == 192 {
        let cipher = Aes192Cbc::new_from_slices(&fkey, &iv).unwrap();
        let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();
        let s = std::str::from_utf8(&decrypted_ciphertext).unwrap();
        Ok(s.to_string())
    } else if algo == 256 {
        let cipher = Aes256Cbc::new_from_slices(&fkey, &iv).unwrap();
        let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();
        let s = std::str::from_utf8(&decrypted_ciphertext).unwrap();
        Ok(s.to_string())
    } else {
        Ok("failed".into())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            encryptfile,
            decryptfile,
            showinfolder,
            encrypttext,
            decrypttext
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
