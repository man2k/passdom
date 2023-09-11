use crate::utilities::passargon::passargon;
use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};
use dirs;
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;

type Aes128Cbc = Cbc<Aes128, Pkcs7>;
type Aes256Cbc = Cbc<Aes256, Pkcs7>;
type Aes192Cbc = Cbc<Aes192, Pkcs7>;

// const AES_128: usize = 128;
// const AES_192: usize = 192;
// const AES_256: usize = 256;

#[tauri::command(async)]
pub fn encryptfile(
    file_path: String,
    file_name: String,
    password: String,
    algo: usize,
) -> Result<String, String> {
    println!("path: {}", file_path);
    println!("algo: {}", algo);
    let path = Path::new(&file_path);
    // let display = path.display();
    let mut file = match File::open(&path) {
        Err(_) => return Err("couldnt open file".to_string()),
        Ok(file) => file,
    };
    let mut contents = Vec::new();
    let _ = file.read_to_end(&mut contents);
    let pos = contents.len();
    // println!("pos {}", pos);
    let mut buffer: Vec<u8> = vec![0u8; pos + 100];
    buffer[..pos].copy_from_slice(&contents);

    let (iv, key) = passargon(password, algo / 8).unwrap();
    // println!("iv : {:?} \nkey : {:?}", iv, key);
    if algo == 128 {
        let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
    } else if algo == 192 {
        let cipher = Aes192Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
    } else if algo == 256 {
        let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
        let ciphertext = match cipher.encrypt(&mut buffer, pos) {
            Err(_) => return Err("encryption failed".to_string()),
            Ok(cipt) => cipt,
        };
        let finalchipher = [ciphertext, &iv].concat();
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
        fil.write_all(&finalchipher)
            .expect("Error Saving Encrypted File");
    } else {
        return Ok("failed".to_string());
    }
    Ok("done".to_string())
}

// const AES_128: usize = 128;
// const AES_192: usize = 192;
// const AES_256: usize = 256;

// enum EncryptionKind {
//     A128(Cbc<Aes128, Pkcs7>),
//     A192(Cbc<Aes192, Pkcs7>),
//     A256(Cbc<Aes256, Pkcs7>),
// }

// #[derive(Debug, thiserror::Error)]
// enum Error {
//     #[error(transparent)]
//     Io(#[from] std::io::Error),
// }

// impl serde::Serialize for Error {
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::ser::Serializer,
//     {
//         serializer.serialize_str(self.to_string().as_ref())
//     }
// }

// #[tauri::command]
// pub fn encryptfile(
//     file_path: String,
//     file_name: String,
//     password: String,
//     algo: usize,
// ) -> Result<(), Error> {
//     println!("path: {}", file_path);
//     println!("algo: {}", algo);
//     let path = Path::new(&file_path);
//     // let display = path.display();
//     // let mut file = match File::open(&path) {
//     //     Err(_) => return Err("couldnt open file".to_string()),
//     //     Ok(file) => file,
//     // };
//     let mut file = File::open(path)?;
//     let mut contents = Vec::new();
//     file.read_to_end(&mut contents)?;
//     let pos = contents.len();
//     // println!("pos {}", pos);
//     let mut buffer: Vec<u8> = vec![0u8; pos + 100];
//     buffer[..pos].copy_from_slice(&contents);

//     let (iv, key) = passargon(password, algo / 8)?;
//     // println!("iv : {:?} \nkey : {:?}", iv, key);
//     // if algo == 128 {
//     //     let cipher = Aes128Cbc::new_from_slices(&key, &iv).unwrap();
//     //     let ciphertext = match cipher.encrypt(&mut buffer, pos) {
//     //         Err(_) => return Err("encryption failed".to_string()),
//     //         Ok(cipt) => cipt,
//     //     };
//     //     let finalchipher = [ciphertext, &iv].concat();
//     //     let downloads = dirs::download_dir().expect("Could not find downloads directory");
//     //     let finalpath = downloads.join(file_name);
//     //     let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
//     //     fil.write_all(&finalchipher)
//     //         .expect("Error Saving Encrypted File");
//     // } else if algo == 192 {
//     //     let cipher = Aes192Cbc::new_from_slices(&key, &iv).unwrap();
//     //     let ciphertext = match cipher.encrypt(&mut buffer, pos) {
//     //         Err(_) => return Err("encryption failed".to_string()),
//     //         Ok(cipt) => cipt,
//     //     };
//     //     let finalchipher = [ciphertext, &iv].concat();
//     //     let downloads = dirs::download_dir().expect("Could not find downloads directory");
//     //     let finalpath = downloads.join(file_name);
//     //     let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
//     //     fil.write_all(&finalchipher)
//     //         .expect("Error Saving Encrypted File");
//     // } else if algo == 256 {
//     //     let cipher = Aes256Cbc::new_from_slices(&key, &iv).unwrap();
//     //     let ciphertext = match cipher.encrypt(&mut buffer, pos) {
//     //         Err(_) => return Err("encryption failed".to_string()),
//     //         Ok(cipt) => cipt,
//     //     };
//     //     let finalchipher = [ciphertext, &iv].concat();
//     //     let downloads = dirs::download_dir().expect("Could not find downloads directory");
//     //     let finalpath = downloads.join(file_name);
//     //     let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
//     //     fil.write_all(&finalchipher)
//     //         .expect("Error Saving Encrypted File");
//     // } else {
//     //     return Ok("failed".to_string());
//     // }
//     // Ok("done".to_string())
//     let mut cipher: EncryptionKind = match algo {
//         AES_128 => EncryptionKind::A128(Aes128Cbc::new_from_slices(&key, &iv)?),
//         AES_192 => EncryptionKind::A192(Aes192Cbc::new_from_slices(&key, &iv)?),
//         AES_256 => EncryptionKind::A256(Aes256Cbc::new_from_slices(&key, &iv)?),
//         // _ => return Err("Invalid algorithm"),
//     };
//     let ciphertext = cipher.encrypt(&mut contents)?;
//     let ciphertext2 = match algo {
//         AES_128 => AES(cipher),
//     };
//     let downloads = dirs::download_dir().ok_or("Could not find downloads directory")?;
//     let final_path = downloads.join(file_name);
//     let mut file = File::create(final_path)?;

//     file.write_all(&ciphertext)?;

//     Ok(())
//     // println!("type chi: {}", type_of(ciphertext));
//     // println!("type chi: {:?}", ciphertext);
//     // println!("type chi: {:?}", finalChipher);

//     // println!("\nCiphertext: {:?}", hex::encode(ciphertext));
//     // println!("\nCiphertext: {:?}", ciphertext);
// }
