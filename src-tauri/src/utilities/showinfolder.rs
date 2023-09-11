use dirs;
use std::process::Command;

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
