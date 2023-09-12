use crate::commands::lib::Aes256Cbc;
use crate::utilities::keygen::keygenargon;
use block_modes::BlockMode;
use std::panic;
use steganography::decoder::*;
use steganography::util::*;

#[tauri::command(async)]
pub fn desteganograph(
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
    // println!("Dec : {}", s);
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
    // let s = std::str::from_utf8(&decrypted_ciphertext).unwrap();
    // println!("Dec : {}", s);
    // return s.to_string();
    // }
}
