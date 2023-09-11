use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};

use crate::utilities::keygen::keygenargon;

type Aes128Cbc = Cbc<Aes128, Pkcs7>;
type Aes256Cbc = Cbc<Aes256, Pkcs7>;
type Aes192Cbc = Cbc<Aes192, Pkcs7>;

#[tauri::command(async)]
pub fn decrypttext(text: String, password: String, algo: usize) -> Result<String, String> {
    let plaintext = match hex::decode(text) {
        Err(_) => return Err("format error".to_string()),
        Ok(e) => e,
    };
    let (content, iv) = plaintext.split_at(plaintext.len() - 16);
    let fkey = keygenargon(password, algo / 8, iv.try_into().unwrap()).unwrap();

    let mut buffer = content.to_vec();
    // println!("key : {}", encode(&fkey));
    // println!("iv : {}", encode(&iv));
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
