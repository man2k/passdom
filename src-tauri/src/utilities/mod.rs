use argon2::Argon2;
use dirs;
use rand::Rng;
use std::process::Command;

pub fn keygenargon(password: String, size: usize, salt: [u8; 16]) -> Result<Vec<u8>, &'static str> {
    let mut output_key_material = vec![0u8; size]; // Can be any desired size
    let _ =
        Argon2::default().hash_password_into(password.as_bytes(), &salt, &mut output_key_material);
    Ok(output_key_material)
}

pub fn passargon(password: String, size: usize) -> Result<([u8; 16], Vec<u8>), &'static str> {
    let mut salt: [u8; 16] = [0u8; 16];
    let mut rng = rand::thread_rng();
    rng.fill(&mut salt);
    let mut output_key_material = vec![0u8; size]; // Can be any desired size
    let _ =
        Argon2::default().hash_password_into(password.as_bytes(), &salt, &mut output_key_material);
    Ok((salt, output_key_material))
}

#[tauri::command(async)]
pub fn showinfolder(file_name: String, file_path: String) -> Result<String, ()> {
    if file_path == "" {
        let downloads = dirs::download_dir().expect("Could not find downloads directory");
        let finalpath = downloads.join(file_name);
        let fp = finalpath.to_str().unwrap();
        println!("path opened: {}", fp);
        Command::new("explorer")
            .args(["/select,", fp])
            .spawn()
            .unwrap();
        Ok(format!("Done"))
    } else {
        println!("path opened: {}", file_path);
        Command::new("explorer")
            .args(["/select,", file_path.as_str()])
            .spawn()
            .unwrap();
        Ok(format!("Done"))
    }
}
