use super::super::utilities::passargon;
use super::lib::{Aes128Cbc, Aes192Cbc, Aes256Cbc, Algorithms, Error};
use block_modes::BlockMode;
use dirs;
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;

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
    file.read_to_end(&mut contents)?;
    let pos = contents.len();
    // println!("pos {}", pos);
    let mut buffer: Vec<u8> = vec![0u8; pos + 100];
    buffer[..pos].copy_from_slice(&contents);
    let (iv, key) = passargon(password, algo / 8).unwrap();
    let downloads = dirs::download_dir().expect("Could not find downloads directory");
    let finalpath = downloads.join(file_name);
    let mut fil = File::create(finalpath).expect("Error Creating Encrypted File");
    println!("iv : {:?} \nkey : {:?}", iv, key);

    let cipher: Algorithms = match algo {
        128 => Algorithms::AES128(Aes128Cbc::new_from_slices(&key, &iv).unwrap()),
        192 => Algorithms::AES192(Aes192Cbc::new_from_slices(&key, &iv).unwrap()),
        256 => Algorithms::AES256(Aes256Cbc::new_from_slices(&key, &iv).unwrap()),
        _ => todo!(),
    };

    let ciphertext = cipher.encrypt(&mut buffer, pos)?;
    let finalchipher = [ciphertext, iv.to_vec()].concat();
    fil.write_all(&finalchipher)
        .expect("Error Saving Encrypted File");

    Ok(())
}

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn encryptfile_test() {
//         encryptfile(
//             r"M:\pROGRAMMING fILES\DedSec\passdomtauri\passdomNative\src-tauri\tests\testfiles\abc.jpg".to_string(),
//             "abc.jpg".to_string(),
//             "testpassword".to_string(),
//             256,
//         )
//         .unwrap();
//     }
// }
