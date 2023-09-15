use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::BlockMode;
use block_modes::Cbc;
use thiserror;

pub type Aes256Cbc = Cbc<Aes256, Pkcs7>;
pub type Aes128Cbc = Cbc<Aes128, Pkcs7>;
pub type Aes192Cbc = Cbc<Aes192, Pkcs7>;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub enum Algorithms {
    AES128(Aes128Cbc),
    AES192(Aes192Cbc),
    AES256(Aes256Cbc),
}

impl Algorithms {
    pub fn decrypt(&self, buffer: &mut Vec<u8>) -> Result<Vec<u8>, Error> {
        let decryptedtext = match self {
            Algorithms::AES128(cipher) => cipher
                .clone()
                .decrypt(buffer)
                .map_err(|_| "encryption failed".to_string())
                .unwrap()
                .to_vec(),
            Algorithms::AES192(cipher) => cipher
                .clone()
                .decrypt(buffer)
                .map_err(|_| "encryption failed".to_string())
                .unwrap()
                .to_vec(),
            Algorithms::AES256(cipher) => cipher
                .clone()
                .decrypt(buffer)
                .map_err(|_| "encryption failed".to_string())
                .unwrap()
                .to_vec(),
        };
        Ok(decryptedtext)
    }

    pub fn encrypt(&self, buffer: &mut Vec<u8>, pos: usize) -> Result<Vec<u8>, Error> {
        let ciphertext = match self {
            Algorithms::AES128(cipher) => cipher
                .clone()
                .encrypt(buffer, pos)
                .map_err(|_| "encryption failed".to_string())
                .unwrap()
                .to_vec(),
            Algorithms::AES192(cipher) => cipher
                .clone()
                .encrypt(buffer, pos)
                .map_err(|_| "encryption failed".to_string())
                .unwrap()
                .to_vec(),
            Algorithms::AES256(cipher) => cipher
                .clone()
                .encrypt(buffer, pos)
                .map_err(|_| "encryption failed".to_string())
                .unwrap()
                .to_vec(),
        };
        Ok(ciphertext)
    }
}
