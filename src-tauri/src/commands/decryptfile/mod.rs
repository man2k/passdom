use super::super::utilities::keygenargon;
use super::lib::{Aes128Cbc, Aes192Cbc, Aes256Cbc, Algorithms};
use block_modes::BlockMode;
use dirs;
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;

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
    let downloads = dirs::download_dir().expect("Could not find downloads directory");
    let finalpath = downloads.join(file_name);
    let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");

    let cipher = match algo {
        128 => Algorithms::AES128(Aes128Cbc::new_from_slices(&fkey, &iv).unwrap()),
        192 => Algorithms::AES192(Aes192Cbc::new_from_slices(&fkey, &iv).unwrap()),
        256 => Algorithms::AES256(Aes256Cbc::new_from_slices(&fkey, &iv).unwrap()),
        _ => todo!(),
    };
    let decrypted_ciphertext = match cipher.decrypt(&mut buffer) {
        Err(_) => return Err("decryption failed".to_string()),
        Ok(decrypted_ciphertext) => decrypted_ciphertext,
    };
    fil.write_all(&decrypted_ciphertext)
        .expect("Error Saving Encrypted File");
    Ok("ok".to_string())
}
