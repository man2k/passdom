use super::super::utilities::passargon;
use super::lib::{Aes128Cbc, Aes192Cbc, Aes256Cbc, Algorithms, Error};
use block_modes::BlockMode;
use hex::encode;
use std::vec;

#[tauri::command(async)]
pub fn encrypttext(text_str: String, password: String, algo: usize) -> Result<String, Error> {
    let plaintext = text_str.as_bytes();
    let pos = plaintext.len();
    let mut buffer: Vec<u8> = vec![0u8; pos + 100];
    buffer[..pos].copy_from_slice(&plaintext);
    let (iv, key) = passargon(password, algo / 8).unwrap();

    let cipher: Algorithms = match algo {
        128 => Algorithms::AES128(Aes128Cbc::new_from_slices(&key, &iv).unwrap()),
        192 => Algorithms::AES192(Aes192Cbc::new_from_slices(&key, &iv).unwrap()),
        256 => Algorithms::AES256(Aes256Cbc::new_from_slices(&key, &iv).unwrap()),
        _ => todo!(),
    };

    let ciphertext = cipher.encrypt(&mut buffer, pos)?;
    let finalchipher = [ciphertext, iv.to_vec()].concat();
    // println!("final {:?}", finalchipher);
    Ok(encode(finalchipher))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn encrypttext_integrity() {
        assert_ne!(
            encrypttext(
                "This is a test".to_string(),
                "testpassword".to_string(),
                256
            )
            .unwrap(),
            encrypttext(
                "This is a test".to_string(),
                "testpassword".to_string(),
                256
            )
            .unwrap()
        )
    }
}
