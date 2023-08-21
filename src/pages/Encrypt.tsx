import { ReactNode } from "react";
import encryption from "../assets/encryption.png";
import { ChipherList } from "../constants";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import CryptoJS from "crypto-js";
import fileDownload from "js-file-download";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";

const Encrypt: ReactNode = () => {
  const [textOrFile, setTextOrFile] = useState<boolean>(false);
  const [_encType, setEncType] = useState<string>("");

  const [file, setFile] = useState<string>("");

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
    // const f = file;
    // const buf = await f?.arrayBuffer();
    // console.log(buf);

    // const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const key = window.crypto.getRandomValues(new Uint8Array(24));
    console.log(key.toString());
    // const wordArray = CryptoJS.lib.WordArray.create(buf);
    // console.log(wordArray);
    // let encrypted = CryptoJS.AES.encrypt(wordArray, key.toString(), {
    // iv: iv,
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.Pkcs7,
    // });
    // console.log(encrypted);
    // let fileEnc = new Blob([encrypted]);
    // fileDownload(fileEnc, "");
    invoke("encryptfile", { filePath: file, key: key });

    // let decrypted = CryptoJS.AES.decrypt(encrypted, key.toString());

    // console.log(decrypted);
    // let dec = await convertWordArrayToUint8Array(decrypted);
    // console.log(dec);
    // let fileDec = new Blob([dec]);
    // console.log(fileDec);
    // fileDownload(fileDec, "");
  };

  const handleFileChange = async (e) => {
    // setFile(e?.target?.files[0]);
    const selected = await open({
      multiple: false,
      // filters: [
      //   {
      //     name: "Image",
      //     extensions: ["png", "jpeg"],
      //   },
      // ],
    });
    console.log(selected);
    // if (Array.isArray(selected)) {
    // user selected multiple files
    // } else
    if (selected === null) {
      // user cancelled the selection
    } else {
      // user selected a single file
      setFile(selected);
    }
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
              // <input
              //   type="file"
              //   className="file-input file-input-error w-full max-w-xs bg-slate-500 rounded-lg font-mono text-black"
              //   onClick={handleFileChange}
              // />
              <button
                className="btn glass btn-warning w-full h-10 rounded-xl shadow-lg shadow-gray-500 overflow-hidden"
                onClick={handleFileChange}
              >
                {file != "" ? `${file.split("\\").pop()}` : "Choose File"}
              </button>
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
                  encryptFile();
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
