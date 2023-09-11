use argon2::Argon2;
use rand::Rng;

pub fn passargon(password: String, size: usize) -> Result<([u8; 16], Vec<u8>), &'static str> {
    let mut salt: [u8; 16] = [0u8; 16];
    let mut rng = rand::thread_rng();
    rng.fill(&mut salt);
    let mut output_key_material = vec![0u8; size]; // Can be any desired size
    let _ =
        Argon2::default().hash_password_into(password.as_bytes(), &salt, &mut output_key_material);
    Ok((salt, output_key_material))
}
