// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
// use anyhow::Result;
use argon2::Argon2;
use chrono::Utc;
use std::panic;

use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};
use dirs;
use hex::encode;
use rand::Rng;
use std::env;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;
use std::process::Command;
use steganography::decoder::*;
use steganography::encoder::*;
use steganography::util::*;
// use tauri::api::file;

type Aes128Cbc = Cbc<Aes128, Pkcs7>;
type Aes256Cbc = Cbc<Aes256, Pkcs7>;
type Aes192Cbc = Cbc<Aes192, Pkcs7>;

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
    let mut output_key_material = vec![0u8; size]; // Can be any desired size
    let _ =
        Argon2::default().hash_password_into(password.as_bytes(), &salt, &mut output_key_material);
    Ok(output_key_material)
}

#[tauri::command(async)]
fn steganograph(
    img_path: String,
    data: String,
    password: String,
    file_path: String,
) -> Result<String, String> {
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
    if file_path == "" {
        // println!("No file");
        let plaintext = data.as_bytes();
        let pos = plaintext.len();
        let mut buffer: Vec<u8> = vec![0u8; pos + 100];
        buffer[..pos].copy_from_slice(&plaintext);
        let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_e) => return Err("encryption failed".to_string()),
            Ok(e) => e,
        };
        let finalchipher = [ciphertext, &iv].concat();
        // println!("{:?}", finalchipher);

        // let payload = str_to_bytes(&data);
        let payload = &finalchipher;

        let destination_image = file_as_dynamic_image(img_path);
        let enc = Encoder::new(payload, destination_image);
        let result = enc.encode_alpha();

        save_image_buffer(result, finalpath.to_str().unwrap().to_string());
        return Ok(finalpath.to_str().unwrap().to_string());
    } else if file_path != "" {
        println!("with file");

        let path = Path::new(&file_path);
        // let display = path.display();
        let mut file = match File::open(&path) {
            Err(_) => return Err("couldnt open file".to_string()),
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
        return Ok(finalpath.to_str().unwrap().to_string());
    }

    Ok("done".to_string())
}

#[tauri::command(async)]
fn desteganograph(
    img_path: String,
    password: String,
    _fileortext: bool,
    _finalpath: String,
) -> Result<String, String> {
    // if !fileortext {
    let encoded_image = file_as_image_buffer(img_path);

    let dec = Decoder::new(encoded_image);
    let out_buffer = dec.decode_alpha();
    let clean_buffer: Vec<u8> = out_buffer.into_iter().filter(|b| *b != 0xff_u8).collect();
    // println!("clean_buffer : {:?}", clean_buffer);

    // DECRYPTION
    let plaintext2 = clean_buffer;
    let (content, ivv) = match panic::catch_unwind(|| plaintext2.split_at(plaintext2.len() - 16)) {
        Err(_e) => {
            return Err("invalid image".to_string());
        }
        Ok((content, ivv)) => (content, ivv),
    };

    let mut buffer = content.to_vec();
    let fkey = keygenargon(password, 32, ivv.try_into().unwrap()).unwrap();
    let cipher = Aes256Cbc::new_from_slices(&fkey, &ivv).unwrap();
    let decrypted_ciphertext = match cipher.decrypt(&mut buffer) {
        Err(_e) => return Err("decryption failed".to_string()),
        Ok(e) => e,
    };
    let s = std::str::from_utf8(&decrypted_ciphertext).unwrap();
    println!("Dec : {}", s);
    return Ok(s.to_string());
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
    //     let mut buffer = content.to_vec();
    //     let fkey = keygenargon(password, 32, ivv.try_into().unwrap()).unwrap();
    //     let cipher = Aes256Cbc::new_from_slices(&fkey, &ivv).unwrap();
    //     let decrypted_ciphertext = cipher.decrypt(&mut buffer).unwrap();
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
async fn showinfolder(file_name: String, file_path: String) -> Result<String, ()> {
    if file_path == "" {
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let fp = finalpath.to_str().unwrap();
        println!("save path: {}", fp);
        Command::new("explorer")
            .args(["/select,", fp])
            .spawn()
            .unwrap();
        Ok(format!("Done"))
    } else {
        println!("save path: {}", file_path);
        Command::new("explorer")
            .args(["/select,", file_path.as_str()])
            .spawn()
            .unwrap();
        Ok(format!("Done"))
    }
}

#[tauri::command(async)]
fn encryptfile(
    file_path: String,
    file_name: String,
    password: String,
    algo: usize,
) -> Result<String, String> {
    println!("path: {}", file_path);
    println!("algo: {}", algo);
    let path = Path::new(&file_path);
    // let display = path.display();
    let mut file = match File::open(&path) {
        Err(_) => return Err("couldnt open file".to_string()),
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
        let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
    } else if algo == 192 {
        let cipher = Aes192Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
    } else if algo == 256 {
        let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
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

#[tauri::command(async)]
fn encrypttext(text_str: String, password: String, algo: usize) -> Result<String, String> {
    println!("encrypt text working...");
    let plaintext = text_str.as_bytes();
    let pos = plaintext.len();
    let mut buffer: Vec<u8> = vec![0u8; pos + 100];
    buffer[..pos].copy_from_slice(&plaintext);

    let (iv, key) = passargon(password, algo / 8).unwrap();
    println!("iv : {:?} \nkey : {:?}", iv, key);
    if algo == 128 {
        // let key = rand::thread_rng().gen::<[u8; 16]>();
        // let iv = rand::thread_rng().gen::<[u8; 16]>();
        // println!("key : {}", encode(&key));
        // println!("iv : {}", encode(&iv));
        let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();

        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();
        println!("finalchipher : {:?}", finalchipher);
        Ok(encode(finalchipher).into())
    } else if algo == 192 {
        // let key = rand::thread_rng().gen::<[u8; 24]>();
        // let iv = rand::thread_rng().gen::<[u8; 16]>();
        // println!("key : {}", encode(&key));
        // println!("iv : {}", encode(&iv));
        let cipher = Aes192Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();
        println!("finalchipher : {:?}", finalchipher);
        Ok(encode(finalchipher).into())
    } else if algo == 256 {
        // let key = rand::thread_rng().gen::<[u8; 32]>();
        // let iv = rand::thread_rng().gen::<[u8; 16]>();
        // println!("key : {}", encode(&key));
        // println!("iv : {}", encode(&iv));
        let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();
        println!("finalchipher : {:?}", finalchipher);

        Ok(encode(finalchipher).into())
    } else {
        Ok("failed".into())
    }
}

#[tauri::command(async)]
fn decryptfile(
    file_path: String,
    file_name: String,
    password: String,
    algo: usize,
) -> Result<String, String> {
    println!("path: {}", file_path);
    let path = Path::new(&file_path);
    // let display = path.display();
    let mut file = match File::open(&path) {
        Err(_) => return Err("couldn't open file".to_string()),
        Ok(file) => file,
    };
    let mut contents = Vec::new();
    let _ = file.read_to_end(&mut contents);

    let (content, iv) = contents.split_at(contents.len() - 16);

    // let fkey = hex::decode(key).expect("Decoding failed");
    let fkey = keygenargon(password, algo / 8, iv.try_into().unwrap()).unwrap();
    let mut buffer = content.to_vec();

    println!("IV: {}", encode(&iv));
    println!("Key: {}", encode(&fkey));

    if algo == 128 {
        let cipher = Aes128Cbc::new_from_slices(&fkey, &iv).unwrap();
        // let decrypted_ciphertext = cipher.decrypt(&mut buffer)?;
        let decrypted_ciphertext = match cipher.decrypt(&mut buffer) {
            Err(_) => return Err("decryption failed".to_string()),
            Ok(decrypted_ciphertext) => decrypted_ciphertext,
        };
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&decrypted_ciphertext)
            .expect("Error Saving Encrypted File");
        Ok("ok".to_string())
    } else if algo == 192 {
        let cipher = Aes192Cbc::new_from_slices(&fkey, &iv).unwrap();
        let decrypted_ciphertext = match cipher.decrypt(&mut buffer) {
            Err(_) => return Err("decryption failed".to_string()),
            Ok(decrypted_ciphertext) => decrypted_ciphertext,
        };
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&decrypted_ciphertext)
            .expect("Error Saving Encrypted File");
        Ok("ok".to_string())
    } else if algo == 256 {
        let cipher = Aes256Cbc::new_from_slices(&fkey, &iv).unwrap();
        let decrypted_ciphertext = match cipher.decrypt(&mut buffer) {
            Err(_) => return Err("decryption failed".to_string()),
            Ok(decrypted_ciphertext) => decrypted_ciphertext,
        };
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&decrypted_ciphertext)
            .expect("Error Saving Encrypted File");
        Ok("ok".to_string())
    } else {
        Ok("Some Error has occured".to_string())
    }
}

#[tauri::command(async)]
fn decrypttext(text: String, password: String, algo: usize) -> Result<String, String> {
    // let plaintext = text.as_bytes();
    let plaintext = match hex::decode(text) {
        Err(_) => return Err("format error".to_string()),
        Ok(e) => e,
    };
    println!("plain : {:?}", plaintext);
    let (content, iv) = plaintext.split_at(plaintext.len() - 16);
    println!("content : {:?}", content);
    // let fkey = hex::decode(key).expect("Decoding failed");
    let fkey = keygenargon(password, algo / 8, iv.try_into().unwrap()).unwrap();

    let mut buffer = content.to_vec();

    println!("key : {}", encode(&fkey));
    println!("iv : {}", encode(&iv));
    if algo == 128 {
        let cipher = Aes128Cbc::new_from_slices(&fkey, &iv).unwrap();
        let decrypted_ciphertext = match cipher.decrypt(&mut buffer) {
            Err(_) => return Err("decryption failed".to_string()),
            Ok(decrypted_ciphertext) => decrypted_ciphertext,
        };
        let s = std::str::from_utf8(&decrypted_ciphertext).unwrap();
        Ok(s.to_string())
    } else if algo == 192 {
        let cipher = Aes192Cbc::new_from_slices(&fkey, &iv).unwrap();
        let decrypted_ciphertext = match cipher.decrypt(&mut buffer) {
            Err(_) => return Err("decryption failed".to_string()),
            Ok(decrypted_ciphertext) => decrypted_ciphertext,
        };
        let s = std::str::from_utf8(&decrypted_ciphertext).unwrap();
        Ok(s.to_string())
    } else if algo == 256 {
        let cipher = Aes256Cbc::new_from_slices(&fkey, &iv).unwrap();
        let decrypted_ciphertext = match cipher.decrypt(&mut buffer) {
            Err(_) => return Err("decryption failed".to_string()),
            Ok(decrypted_ciphertext) => decrypted_ciphertext,
        };
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
