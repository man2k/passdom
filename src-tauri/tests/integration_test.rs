use passdom::commands::decrypttext::decrypttext;
use passdom::commands::encrypttext::encrypttext;

#[test]
fn test_encryptdecrypttext_128() {
    test_encryptdecrypttext_(128);
}
#[test]
fn test_encryptdecrypttext_192() {
    test_encryptdecrypttext_(192);
}
#[test]
fn test_encryptdecrypttext_256() {
    test_encryptdecrypttext_(256);
}

fn test_encryptdecrypttext_(algo: usize) {
    // use::super::
    let encrypt_test_res = encrypttext(
        format!("This is a test {}", algo),
        "testpassword".to_string(),
        algo,
    )
    .unwrap();

    let decrypt_test_res = decrypttext(encrypt_test_res, "testpassword".to_string(), algo).unwrap();
    assert_eq!(decrypt_test_res, format!("This is a test {}", algo))
}
