use chrono::Utc;
use dirs;
use hex::decode;
use steganography::encoder::*;
use steganography::util::*;

use super::encrypttext::encrypttext;

#[tauri::command(async)]
pub fn steganograph(
    img_path: String,
    data: String,
    password: String,
    _file_path: String,
) -> Result<String, String> {
    let timestamp: i64 = Utc::now().timestamp();
    let downloads = dirs::download_dir().expect("Could not find downloads directory");
    let finalpath = downloads.join(format!("steg-{}.png", timestamp));
    // if file_path == "" {
    let finalcipher = decode(encrypttext(data, password, 256).unwrap()).unwrap();
    let destination_image = file_as_dynamic_image(img_path);
    let enc = Encoder::new(&finalcipher, destination_image);
    let result = enc.encode_alpha();
    save_image_buffer(result, finalpath.to_str().unwrap().to_string());
    Ok(finalpath.to_str().unwrap().to_string())
    // } else if file_path != "" {
    //     let path = Path::new(&file_path);
    //     let mut file = match File::open(&path) {
    //         Err(_) => return Err("couldnt open file".to_string()),
    //         Ok(file) => file,
    //     };
    //     let mut contents = Vec::new();
    //     let _ = file.read_to_end(&mut contents);
    //     let pos = contents.len();
    //     let mut buffer: Vec<u8> = vec![0u8; pos + 100];
    //     buffer[..pos].copy_from_slice(&contents);
    //     let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
    //     let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
    //     let finalchipher = [ciphertext, &iv].concat();
    //     // println!("finalchipher : {:?}", finalchipher);
    //     let payload = &finalchipher;
    //     let destination_image = file_as_dynamic_image(img_path);
    //     let enc = Encoder::new(payload, destination_image);
    //     let result = enc.encode_alpha();
    //     save_image_buffer(result, finalpath.to_str().unwrap().to_string());
    //     return Ok(finalpath.to_str().unwrap().to_string());
    // }
    // Ok("done".to_string())
}
