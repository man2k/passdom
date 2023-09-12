use aes::Aes128;
use aes::Aes192;
use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::Cbc;

pub type Aes256Cbc = Cbc<Aes256, Pkcs7>;
pub type Aes128Cbc = Cbc<Aes128, Pkcs7>;
pub type Aes192Cbc = Cbc<Aes192, Pkcs7>;
