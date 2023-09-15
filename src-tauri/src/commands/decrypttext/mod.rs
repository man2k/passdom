use crate::commands::lib::{Aes128Cbc, Aes192Cbc, Aes256Cbc, Algorithms};
use crate::utilities::keygenargon;
use block_modes::BlockMode;
use std::str::from_utf8;

#[tauri::command(async)]
pub fn decrypttext(text: String, password: String, algo: usize) -> Result<String, String> {
    let plaintext = match hex::decode(text) {
        Err(_) => return Err("format error".to_string()),
        Ok(e) => e,
    };
    let (content, iv) = plaintext.split_at(plaintext.len() - 16);
    let fkey = keygenargon(password, algo / 8, iv.try_into().unwrap()).unwrap();
    let mut buffer = content.to_vec();
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
    let s = from_utf8(&decrypted_ciphertext).unwrap();
    Ok(s.to_string())
}
