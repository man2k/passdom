use crate::commands::lib::{Aes128Cbc, Aes192Cbc, Aes256Cbc};
use crate::utilities::passargon::passargon;
use block_modes::BlockMode;
use dirs;
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use std::vec;
use thiserror;

const AES_128: usize = 128;
const AES_192: usize = 192;
const AES_256: usize = 256;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

// we must manually implement serde::Serialize
impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

enum Algorithms {
    AES128(Aes128Cbc),
    AES192(Aes192Cbc),
    AES256(Aes256Cbc),
}

impl Algorithms {
    fn encrypt(&self, buffer: &mut Vec<u8>, pos: usize) -> Result<Vec<u8>, Error> {
        let ciphertext = match self {
            Algorithms::AES128(cipher) => {
                cipher
                    .clone()
                    .encrypt(buffer, pos)
                    .map_err(|e| e.to_string())
                    .unwrap() // Propagate errors
                    .to_vec()
            }
            Algorithms::AES192(cipher) => {
                cipher
                    .clone()
                    .encrypt(buffer, pos)
                    .map_err(|e| e.to_string())
                    .unwrap() // Propagate errors
                    .to_vec()
            }
            Algorithms::AES256(cipher) => {
                cipher
                    .clone()
                    .encrypt(buffer, pos)
                    .map_err(|e| e.to_string())
                    .unwrap() // Propagate errors
                    .to_vec()
            } // _ => return Err("Error encrypting".into()), // Return an error
        };
        Ok(ciphertext)
    }
}

#[tauri::command(async)]
pub fn encryptfile(
    file_path: String,
    file_name: String,
    password: String,
    algo: usize,
) -> Result<(), Error> {
    println!("path: {}", file_path);
    println!("algo: {}", algo);
    let path = Path::new(&file_path);
    let mut file = match File::open(&path) {
        Err(e) => return Err(e.into()),
        Ok(file) => file,
    };
    let mut contents = Vec::new();
    let _ = file.read_to_end(&mut contents);
    let pos = contents.len();
    // println!("pos {}", pos);
    let mut buffer: Vec<u8> = vec![0u8; pos + 100];
    buffer[..pos].copy_from_slice(&contents);
    let (iv, key) = passargon(password, algo / 8).unwrap();
    let downloads = dirs::download_dir().expect("Could not find downloads directory");
    let finalpath = downloads.join(file_name);
    let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
    // println!("iv : {:?} \nkey : {:?}", iv, key);

    let cipher: Algorithms = match algo {
        AES_128 => Algorithms::AES128(Aes128Cbc::new_from_slices(&key, &iv).unwrap()),
        AES_192 => Algorithms::AES192(Aes192Cbc::new_from_slices(&key, &iv).unwrap()),
        AES_256 => Algorithms::AES256(Aes256Cbc::new_from_slices(&key, &iv).unwrap()),
        _ => todo!(),
    };

    let ciphertext = cipher.encrypt(&mut buffer, pos).unwrap();
    let finalchipher = [ciphertext, iv.to_vec()].concat();
    fil.write_all(&finalchipher)
        .expect("Error Saving Encrypted File");

    Ok(())
}
