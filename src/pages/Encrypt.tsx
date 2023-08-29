import { FC, ReactNode } from "react";
import encryption from "../assets/encryption.png";
import { ChipherList } from "../constants";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { message, open } from "@tauri-apps/api/dialog";
// import CryptoJS from "crypto-js";
// import fileDownload from "js-file-download";

const Encrypt: FC = () => {
  const [textOrFile, setTextOrFile] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const [chiphertext, setChiphertext] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [algo, setAlgo] = useState<number>(0);

  // const convertWordArrayToUint8Array = async (wordArray) => {
  //   var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
  //   var length = wordArray.hasOwnProperty("sigBytes")
  //     ? wordArray.sigBytes
  //     : arrayOfWords.length * 4;
  //   var uInt8Array = new Uint8Array(length),
  //     index = 0,
  //     word,
  //     i;
  //   for (i = 0; i < length; i++) {
  //     word = arrayOfWords[i];
  //     uInt8Array[index++] = word >> 24;
  //     uInt8Array[index++] = (word >> 16) & 0xff;
  //     uInt8Array[index++] = (word >> 8) & 0xff;
  //     uInt8Array[index++] = word & 0xff;
  //   }
  //   return uInt8Array;
  // };

  const handleTextchange = (e) => {
    setText(e.target.value);
  };

  const encryptFile = async () => {
    // const f = file;
    // const buf = await f?.arrayBuffer();
    // console.log(buf);

    // const iv = window.crypto.getRandomValues(new Uint8Array(16));
    // const key = window.crypto.getRandomValues(new Uint8Array(24));
    // console.log(key.toString());
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

    // let decrypted = CryptoJS.AES.decrypt(encrypted, key.toString());

    // console.log(decrypted);
    // let dec = await convertWordArrayToUint8Array(decrypted);
    // console.log(dec);
    // let fileDec = new Blob([dec]);
    // console.log(fileDec);
    // fileDownload(fileDec, "");
    // console.log(algo);
    // console.log(typeof algo);
    if (textOrFile === false) {
      invoke("encryptfile", {
        filePath: filePath,
        fileName: filePath.split("\\").pop() + ".enc",
        algo: algo,
      })
        .then((message) => {
          setKey(message);
          window.my_modal_2.showModal();
        })
        .catch((error) => console.error(error));
    } else if (textOrFile === true) {
      invoke("encrypttext", {
        textStr: text,
        algo: algo,
      })
        .then((message) => {
          console.log(message);
          setKey(message[1]);
          setChiphertext(message[0]);
          window.my_modal_4.showModal();
        })
        .catch((error) => console.error(error));
    }
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
    // console.log(selected?.toString());
    // if (Array.isArray(selected)) {
    // user selected multiple files
    // } else
    if (selected === null) {
      // user cancelled the selection
    } else {
      // user selected a single file
      setFilePath(selected);
    }
  };

  const handleAlgoChange = (e) => {
    if (e.target.value === "aes-128-cbc") {
      setAlgo(128);
    } else if (e.target.value === "aes-192-cbc") {
      setAlgo(192);
    } else if (e.target.value === "aes-256-cbc") {
      setAlgo(256);
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
                className="textarea textarea-warning w-full max-w-xs bg-slate-500 rounded-lg font-mono text-black h-10 shadow-lg shadow-gray-800"
                placeholder="Type here"
                onChange={handleTextchange}
              ></textarea>
            ) : (
              <button
                className="btn glass bg-inherit w-full h-10 rounded-xl shadow-lg shadow-gray-800 overflow-hidden text-black"
                onClick={handleFileChange}
              >
                {filePath != ""
                  ? `${filePath.split("\\").pop()}`
                  : "Choose File"}
              </button>
            )}
            <select
              className="select select-secondary bg-gray-800 w-full max-w-xs uppercase text-stone-200 shadow-lg shadow-gray-800 mt-0.5"
              onChange={(e) => {
                handleAlgoChange(e);
              }}
            >
              <option disabled selected className="lowercase text-black">
                Select your algorithm!
              </option>
              {ChipherList.map((item) => (
                <option key={item.value}>{item.label}</option>
              ))}
            </select>

            <div className="card-actions justify-end">
              <button
                className="btn bg-slate-400 hover:bg-teal-500 w-full h-full rounded-lg text-black mt-0.5 shadow-lg shadow-gray-800"
                // disabled={algo != 0 && filePath != "" ? false : true}
                onClick={async () => {
                  // if (
                  //   (algo != 128 || algo != 192 || algo != 256) &&
                  //   (filePath == "" || text != "")
                  // ) {
                  //   window.my_modal_3.showModal();
                  // }
                  await encryptFile();
                }}
              >
                Encrypt
              </button>
              <dialog id="my_modal_2" className="modal">
                <form method="dialog" className="modal-box">
                  <h3 className="font-bold text-lg">
                    File Encrypted Successfully.
                  </h3>
                  <p className="py-4 overflow-hidden">
                    Your Key: <br />
                    <textarea
                      className="textarea textarea-accent w-full text-white bg-slate-800 font-mono cursor-pointer"
                      readOnly
                      value={key}
                      onClick={(e) => {
                        if (e.target.value !== "") {
                          navigator.clipboard.writeText(e.target.value);
                          e.target.value = "copied to clipboard..";
                          setTimeout(() => {
                            e.target.value = key;
                          }, 900);
                        }
                      }}
                    />
                    {/* {key} */}
                    {/* </textarea> */}
                    {/* <span
                      className=""
                      onClick={(e) => {
                        if (e.target.innerText !== "") {
                          navigator.clipboard.writeText(e.target.innerText);
                          e.target.innerText = "copied to clipboard..";
                          setTimeout(() => {
                            e.target.innerText = key;
                          }, 900);
                        }
                      }}
                    >
                      <p className="cursor-pointer flex break-words">{key}</p>
                    </span> */}
                    <br />
                    <span
                      className="text-xs italic ml-72 shadow-lg border-2 text-white border-gray-500 rounded-full p-1 cursor-pointer"
                      onClick={(e) => {
                        if (e.target.innerText !== "") {
                          navigator.clipboard.writeText(key);
                          // let tmp = e.target.innerText;
                          e.target.innerText = "copied to clipboard..";
                          setTimeout(() => {
                            e.target.innerText = "click to copy";
                          }, 900);
                        }
                      }}
                    >
                      click to copy
                    </span>
                  </p>
                  <button
                    className="btn bg-green-500 text-black hover:bg-green-400 rounded-full mt-2"
                    onClick={() => {
                      const ffilePath = filePath.split("\\");
                      const fileName = ffilePath.pop() + ".enc";
                      // const fp =
                      //   ffilePath.join("\\") + "\\" + fileName + ".enc";
                      // console.log(fp);
                      invoke("showinfolder", {
                        fileName: fileName,
                      }).then((message) => {
                        console.log(message);
                        // window.my_modal_2.showModal();
                      });
                    }}
                  >
                    Show in folder
                  </button>
                </form>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
              <dialog id="my_modal_3" className="modal">
                <form method="dialog" className="modal-box">
                  <h3 className="font-bold text-lg">Wait!</h3>
                  <p className="py-4">
                    Some of the required inputs are missing.
                    <br />
                    Please Recheck.
                  </p>
                </form>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
              <dialog id="my_modal_4" className="modal">
                <form method="dialog" className="modal-box">
                  <h3 className="font-bold text-lg">Encryption Successful!</h3>
                  <p className="py-4 flex-col">
                    Your Key:
                    <input
                      type="text"
                      value={key}
                      readOnly
                      className="input input-bordered input-primary w-80 ml-14 shadow-lg shadow-violet-700 border-0 bg-slate-800 cursor-pointer"
                      onClick={(e) => {
                        if (e.target.value !== "") {
                          navigator.clipboard.writeText(key);
                          // let tmp = e.target.innerText;
                          e.target.value = "copied to clipboard..";
                          setTimeout(() => {
                            e.target.value = key;
                          }, 900);
                        }
                      }}
                    />
                    <br />
                    Encrypted Text:
                    <input
                      type="text"
                      value={chiphertext}
                      readOnly
                      className="input input-bordered input-accent w-full max-w-xs ml-1 mt-2 shadow-lg shadow-violet-700 border-0 bg-slate-800 cursor-pointer"
                      onClick={(e) => {
                        if (e.target.value !== "") {
                          navigator.clipboard.writeText(chiphertext);
                          // let tmp = e.target.innerText;
                          e.target.value = "copied to clipboard..";
                          setTimeout(() => {
                            e.target.value = chiphertext;
                          }, 900);
                        }
                      }}
                    />
                    <div className="mt-5 ml-14">
                      <span className="text-xs italic ml-72 shadow-lg border-2 text-white border-gray-500 rounded-full p-1 cursor-default">
                        click to copy
                      </span>
                    </div>
                  </p>
                </form>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encrypt;
