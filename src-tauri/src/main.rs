// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// use aes::cipher::generic_array::functional;
use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
use argon2::Argon2;
use chrono::Utc;

use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};
use hex::encode;
use rand::Rng;
use std::env;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;
use steganography::decoder::*;
use steganography::encoder::*;
use steganography::util::*;
use tauri::api::file;

use dirs;
use std::process::Command;

type Aes128Cbc = Cbc<Aes128, Pkcs7>;
type Aes256Cbc = Cbc<Aes256, Pkcs7>;
type Aes192Cbc = Cbc<Aes192, Pkcs7>;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

// fn type_of<T>(_: T) -> &'static str {
//     type_name::<T>()
// }

fn passargon(password: String, size: usize) -> Result<([u8; 16], Vec<u8>), &'static str> {
    let mut salt: [u8; 16] = [0u8; 16];
    let mut rng = rand::thread_rng();
    rng.fill(&mut salt);
    let mut output_key_material = vec![0u8; size]; // Can be any desired size
    let _ =
        Argon2::default().hash_password_into(password.as_bytes(), &salt, &mut output_key_material);
    Ok((salt, output_key_material))
}
fn keygenargon(password: String, size: usize, salt: [u8; 16]) -> Result<Vec<u8>, &'static str> {
    // let mut salt: [u8; 16] = [0u8; 16];
    // let mut salty= salt;
    let mut output_key_material = vec![0u8; size]; // Can be any desired size
    let _ =
        Argon2::default().hash_password_into(password.as_bytes(), &salt, &mut output_key_material);
    Ok(output_key_material)
}

#[tauri::command]
async fn steganograph(
    img_path: String,
    data: String,
    password: String,
    file_path: String,
) -> String {
    let (iv, key) = passargon(password, 32).unwrap();
    println!("IV : {:?}", iv); // IV
    println!("Key : {:?}", key); // passhash\key

    let dt = Utc::now();
    let timestamp: i64 = dt.timestamp();

    // println!("Current timestamp is {}", timestamp);
    let downloads = dirs::download_dir().expect("Could not find downloads directory");
    let finalpath = downloads.join(format!("steg-{}.png", timestamp));
    // let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
    // fil.write_all(&finalchipher)
    //     .expect("Error Saving Encrypted File");

    // let message = "This is a steganography demo!".to_string();
    //Convert our string to bytes
    if file_path == "" {
        println!("No file");
        let plaintext = data.as_bytes();
        let pos = plaintext.len();
        let mut buffer: Vec<u8> = vec![0u8; pos + 100];
        buffer[..pos].copy_from_slice(&plaintext);
        let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        // println!("{:?}", finalchipher);

        // let payload = str_to_bytes(&data);
        let payload = &finalchipher;

        let destination_image = file_as_dynamic_image(img_path);
        //Create an encoder
        let enc = Encoder::new(payload, destination_image);
        //Encode our message into the alpha channel of the image
        let result = enc.encode_alpha();
        //Save the new image
        // save_image_buffer(
        //     result,
        //     r"M:\pROGRAMMING fILES\DedSec\passdomtauri\passdomNative\src\assets\hidden_message.png"
        //         .to_string(),
        // );
        save_image_buffer(result, finalpath.to_str().unwrap().to_string());
        return finalpath.to_str().unwrap().to_string();
    } else if file_path != "" {
        println!("with file");

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
        let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        // println!("finalchipher : {:?}", finalchipher);

        // let payload = str_to_bytes(&data);
        let payload = &finalchipher;

        let destination_image = file_as_dynamic_image(img_path);
        //Create an encoder
        let enc = Encoder::new(payload, destination_image);
        //Encode our message into the alpha channel of the image
        let result = enc.encode_alpha();
        //Save the new image
        save_image_buffer(result, finalpath.to_str().unwrap().to_string());
        return finalpath.to_str().unwrap().to_string();
    }

    "done".to_string()
}

#[tauri::command]
async fn desteganograph(
    img_path: String,
    password: String,
    fileortext: bool,
    finalpath: String,
) -> String {
    // if !fileortext {
    let encoded_image = file_as_image_buffer(img_path);

    let dec = Decoder::new(encoded_image);
    let out_buffer = dec.decode_alpha();
    let clean_buffer: Vec<u8> = out_buffer.into_iter().filter(|b| *b != 0xff_u8).collect();
    // println!("clean_buffer : {:?}", clean_buffer);

    // DECRYPTION
    let plaintext2 = clean_buffer;
    let (content, ivv) = plaintext2.split_at(plaintext2.len() - 16);
    let mut buf = content.to_vec();
    let fkey = keygenargon(password, 32, ivv.try_into().unwrap()).unwrap();
    let cipher = Aes256Cbc::new_from_slices(&fkey, &ivv).unwrap();
    let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();
    let s = std::str::from_utf8(&decrypted_ciphertext).unwrap();
    println!("Dec : {}", s);
    return s.to_string();
    // }
    // } else {
    //     let encoded_image = file_as_image_buffer(img_path);

    //     let dec = Decoder::new(encoded_image);
    //     let out_buffer = dec.decode_alpha();
    //     let clean_buffer: Vec<u8> = out_buffer.into_iter().filter(|b| *b != 0xff_u8).collect();
    //     // println!("clean_buffer : {:?}", clean_buffer);

    //     // DECRYPTION
    //     let plaintext2 = clean_buffer;
    //     let (content, ivv) = plaintext2.split_at(plaintext2.len() - 16);
    //     let mut buf = content.to_vec();
    //     let fkey = keygenargon(password, 32, ivv.try_into().unwrap()).unwrap();
    //     let cipher = Aes256Cbc::new_from_slices(&fkey, &ivv).unwrap();
    //     let decrypted_ciphertext = cipher.decrypt(&mut buf).unwrap();
    //     // let downloads = dirs::download_dir().expect("Could not find downloads directory");
    //     println!("{}", finalpath);
    //     let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
    //     fil.write_all(&decrypted_ciphertext)
    //         .expect("Error Saving Encrypted File");
    //     "This worked!".into()
    //     // let s = std::str::from_utf8(&decrypted_ciphertext).unwrap();
    //     // println!("Dec : {}", s);
    //     // return s.to_string();
    // }
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
async fn encryptfile(
    file_path: String,
    file_name: String,
    password: String,
    algo: usize,
) -> Result<String, ()> {
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

    let (iv, key) = passargon(password, algo / 8).unwrap();
    println!("iv : {:?} \nkey : {:?}", iv, key);
    if algo == 128 {
        // let iv = rand::thread_rng().gen::<[u8; 16]>();
        // let key = rand::thread_rng().gen::<[u8; 16]>();
        // println!("Key: {}", encode(&key));
        // println!("IV: {}", encode(&iv));
        let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
        // Ok(encode(key).into())
    } else if algo == 192 {
        // let iv = rand::thread_rng().gen::<[u8; 16]>();
        // let key = rand::thread_rng().gen::<[u8; 24]>();
        // println!("Key: {}", encode(key));
        // println!("IV: {}", encode(iv));
        let cipher = Aes192Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
        // Ok(encode(key).into())
    } else if algo == 256 {
        // let iv = rand::thread_rng().gen::<[u8; 16]>();
        // let key = rand::thread_rng().gen::<[u8; 32]>();
        // println!("Key: {}", encode(key));
        // println!("IV: {}", encode(iv));
        let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
        // Ok(encode(key).into())
    } else {
        return Ok("failed".to_string());
    }
    Ok("done".to_string())
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
async fn decryptfile(
    file_path: String,
    file_name: String,
    password: String,
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

    // let fkey = hex::decode(key).expect("Decoding failed");
    let fkey = keygenargon(password, algo / 8, iv.try_into().unwrap()).unwrap();
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
