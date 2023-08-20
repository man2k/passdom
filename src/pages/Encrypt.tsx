import { FC, ReactNode } from "react";
import encryption from "../assets/encryption.png";
import { ChipherList } from "../constants";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import CryptoJS from "crypto-js";

const Encrypt: FC = () => {
  const [textOrFile, setTextOrFile] = useState<boolean>(false);
  const [_encType, setEncType] = useState<string>("");

  const [file, setFile] = useState<Uint8Array>();

  const convertWordArrayToUint8Array = async (wordArray) => {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes")
      ? wordArray.sigBytes
      : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length),
      index = 0,
      word,
      i;
    for (i = 0; i < length; i++) {
      word = arrayOfWords[i];
      uInt8Array[index++] = word >> 24;
      uInt8Array[index++] = (word >> 16) & 0xff;
      uInt8Array[index++] = (word >> 8) & 0xff;
      uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
  };

  const encryptFile = async () => {
    const f = file;
    const buf = await f?.arrayBuffer();
    // console.log(buf);
    // const bytes = new Uint8Array(buf);
    // console.log(bytes);
    // const wordArray = CryptoJS.lib.WordArray.create(buf);
    // console.log(wordArray);
    // const key = CryptoJS.lib.WordArray.random(24);
    // const key = window.crypto.getRandomValues(new Uint8Array(16));
    // const iv = CryptoJS.lib.WordArray.random(16);
    // const iv = window.crypto.getRandomValues(new Uint8Array(16));
    // console.log(buf);
    // console.log(key.toString(), iv.toString());
    const wordArray = CryptoJS.lib.WordArray.create(buf);
    // console.log(wordArray);
    // console.log(iv);
    // const finalA = wordArray + iv;
    // console.log(finalA);
    let encrypted = CryptoJS.AES.encrypt(wordArray, "key", {
      // iv: iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.Iso97971,
    });
    // console.log(encrypted);
    let decrypted = CryptoJS.AES.decrypt(encrypted, "key");

    // console.log(decrypted);
    let dec = await convertWordArrayToUint8Array(decrypted);
    // console.log(dec);
    let fileDec = new Blob([dec]);
    console.log(fileDec);
    // let textBytes = aesjs.utils.utf8.toBytes(file);
    // // console.log(textBytes);
    // // An example 128-bit key
    // let key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    // // The initialization vector (must be 16 bytes)
    // let iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
    // // let encrypted = CryptoJS.AES.encrypt(textBytes, "lol2k");
    // // let text = "dawdawdawdawdwdadawdadawvdsfada";
    // // let textBytes = aesjs.utils.utf8.toBytes(text);
    // console.log(textBytes);
    // let aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    // let encryptedBytes = aesCbc.encrypt(textBytes);
    // console.log(encryptedBytes);
  };

  const handleFileChange = async (e) => {
    setFile(e?.target?.files[0]);
    // const f = e.target.files[0];
    // const buf = await f?.arrayBuffer();
    // const bytes = new Uint8Array(buf);
    // setFile(bytes);
  };

  return (
    <div className="w-screen h-screen font-mono">
      <div className="flex justify-center h-full items-center">
        <div className="card bg-amber-600 shadow-2xl rounded-lg pt-2 w-96">
          <figure>
            <img src={encryption} alt="Shoes" className="w-48 h-48" />
          </figure>
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title font-mono text-black text-2xl h-6 w-24">
                <span>
                  <TypeAnimation
                    sequence={["Encrypt", 800, "", 300]}
                    speed={50}
                    repeat={Infinity}
                    wrapper="span"
                    cursor={false}
                  />
                </span>
              </h2>

              <div>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-warning border-black"
                  onClick={() => {
                    setTextOrFile((prev) => !prev);
                  }}
                />
              </div>
            </div>
            {textOrFile ? (
              <textarea
                className="textarea textarea-warning w-full max-w-xs bg-slate-500 rounded-lg font-mono text-black h-10"
                placeholder="Type here"
              ></textarea>
            ) : (
              <input
                type="file"
                className="file-input file-input-error w-full max-w-xs bg-slate-500 rounded-lg font-mono text-black"
                onChange={handleFileChange}
              />
            )}
            <select
              className="select bg-amber-500 w-full max-w-xs uppercase text-black"
              onChange={(e) => {
                setEncType(e.target.value);
              }}
            >
              <option disabled selected className="lowercase">
                Select your algorithm!
              </option>
              {ChipherList.map((item) => (
                <option key={item.value}>{item.label}</option>
              ))}
            </select>

            <div className="card-actions justify-end">
              <button
                className="btn bg-slate-400 hover:bg-teal-400 w-full h-full rounded-lg text-black"
                onClick={() => {
                  encryptFile(file);
                }}
              >
                Encrypt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encrypt;
