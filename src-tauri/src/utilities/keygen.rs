use argon2::Argon2;

pub fn keygenargon(password: String, size: usize, salt: [u8; 16]) -> Result<Vec<u8>, &'static str> {
    let mut output_key_material = vec![0u8; size]; // Can be any desired size
    let _ =
        Argon2::default().hash_password_into(password.as_bytes(), &salt, &mut output_key_material);
    Ok(output_key_material)
}
