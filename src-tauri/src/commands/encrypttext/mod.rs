use crate::utilities::passargon::passargon;
use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};
use hex::encode;
type Aes128Cbc = Cbc<Aes128, Pkcs7>;
type Aes256Cbc = Cbc<Aes256, Pkcs7>;
type Aes192Cbc = Cbc<Aes192, Pkcs7>;

#[tauri::command(async)]
pub fn encrypttext(text_str: String, password: String, algo: usize) -> Result<String, String> {
    let plaintext = text_str.as_bytes();
    let pos = plaintext.len();
    let mut buffer: Vec<u8> = vec![0u8; pos + 100];
    buffer[..pos].copy_from_slice(&plaintext);

    let (iv, key) = passargon(password, algo / 8).unwrap();
    // println!("iv : {:?} \nkey : {:?}", iv, key);
    if algo == 128 {
        let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();

        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();
        Ok(encode(finalchipher).into())
    } else if algo == 192 {
        let cipher = Aes192Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();
        Ok(encode(finalchipher).into())
    } else if algo == 256 {
        let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();

        Ok(encode(finalchipher).into())
    } else {
        Ok("failed".into())
    }
}
