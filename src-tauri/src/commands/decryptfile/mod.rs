use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};
use dirs;
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;

use crate::utilities::keygen::keygenargon;

type Aes128Cbc = Cbc<Aes128, Pkcs7>;
type Aes256Cbc = Cbc<Aes256, Pkcs7>;
type Aes192Cbc = Cbc<Aes192, Pkcs7>;

#[tauri::command(async)]
pub fn decryptfile(
    file_path: String,
    file_name: String,
    password: String,
    algo: usize,
) -> Result<String, String> {
    println!("path: {}", file_path);
    let path = Path::new(&file_path);
    let mut file = match File::open(&path) {
        Err(_) => return Err("couldn't open file".to_string()),
        Ok(file) => file,
    };
    let mut contents = Vec::new();
    let _ = file.read_to_end(&mut contents);
    let (content, iv) = contents.split_at(contents.len() - 16);
    let fkey = keygenargon(password, algo / 8, iv.try_into().unwrap()).unwrap();
    let mut buffer = content.to_vec();

    // println!("IV: {}", encode(&iv));
    // println!("Key: {}", encode(&fkey));

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
