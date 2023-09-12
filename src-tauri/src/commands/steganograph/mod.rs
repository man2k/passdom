use crate::commands::lib::Aes256Cbc;
use crate::utilities::passargon::passargon;
use block_modes::BlockMode;
use chrono::Utc;
use dirs;
use std::fs::File;
use std::io::Read;
use std::path::Path;
use steganography::encoder::*;
use steganography::util::*;

#[tauri::command(async)]
pub fn steganograph(
    img_path: String,
    data: String,
    password: String,
    file_path: String,
) -> Result<String, String> {
    let (iv, key) = passargon(password, 32).unwrap();
    // println!("IV : {:?}", iv); // IV
    // println!("Key : {:?}", key); // passhash\key

    let dt = Utc::now();
    let timestamp: i64 = dt.timestamp();

    let downloads = dirs::download_dir().expect("Could not find downloads directory");
    let finalpath = downloads.join(format!("steg-{}.png", timestamp));
    if file_path == "" {
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

        let payload = &finalchipher;

        let destination_image = file_as_dynamic_image(img_path);
        let enc = Encoder::new(payload, destination_image);
        let result = enc.encode_alpha();

        save_image_buffer(result, finalpath.to_str().unwrap().to_string());
        return Ok(finalpath.to_str().unwrap().to_string());
    } else if file_path != "" {
        let path = Path::new(&file_path);
        let mut file = match File::open(&path) {
            Err(_) => return Err("couldnt open file".to_string()),
            Ok(file) => file,
        };
        let mut contents = Vec::new();
        let _ = file.read_to_end(&mut contents);
        let pos = contents.len();
        let mut buffer: Vec<u8> = vec![0u8; pos + 100];
        buffer[..pos].copy_from_slice(&contents);
        let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
        let finalchipher = [ciphertext, &iv].concat();
        // println!("finalchipher : {:?}", finalchipher);

        let payload = &finalchipher;

        let destination_image = file_as_dynamic_image(img_path);
        let enc = Encoder::new(payload, destination_image);
        let result = enc.encode_alpha();
        save_image_buffer(result, finalpath.to_str().unwrap().to_string());
        return Ok(finalpath.to_str().unwrap().to_string());
    }

    Ok("done".to_string())
}
