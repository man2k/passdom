use super::decrypttext::decrypttext;
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
    let stbuffer = hex::encode(clean_buffer);
    let decrypted_ciphertext = decrypttext(stbuffer, password, 256).unwrap();
    return Ok(decrypted_ciphertext);
}
