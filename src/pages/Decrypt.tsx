import { FC, ReactNode } from "react";
import decryption from "../assets/decryption.png";
import { ChipherList } from "../constants";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { message, open } from "@tauri-apps/api/dialog";

const Encrypt: FC = () => {
  const [textOrFile, setTextOrFile] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const [chiphertext, setChiphertext] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [algo, setAlgo] = useState<number>(0);

  const handleAlgoChange = (e) => {
    if (e.target.value === "aes-128-cbc") {
      setAlgo(128);
    } else if (e.target.value === "aes-192-cbc") {
      setAlgo(192);
    } else if (e.target.value === "aes-256-cbc") {
      setAlgo(256);
    }
  };
  const decryptFile = async () => {
    const fileName = filePath.split("\\").pop().replace(".enc", "");
    if (textOrFile === false) {
      invoke("decryptfile", {
        filePath: filePath,
        fileName: fileName,
        key: key,
        algo: algo,
      }).then((message) => {
        console.log(message);
        window.my_modal_2.showModal();
      });
    } else if (textOrFile === true) {
      console.log(text);
      console.log(key);
      invoke("decrypttext", {
        text: text,
        key: key,
        algo: algo,
      }).then((message) => {
        console.log(message);
        setChiphertext(message);
        window.my_modal_2.showModal();
      });
    }
  };

  const handleTextchange = (e) => {
    setText(e.target.value);
  };

  const handleFileChange = async (e) => {
    const selected = await open({
      multiple: false,
    });

    if (selected === null) {
    } else {
      setFilePath(selected);
    }
  };
  return (
    <div className="w-screen h-screen font-mono">
      <div className="flex justify-center h-full items-center">
        <div className="card bg-amber-600 shadow-2xl rounded-lg pt-3 w-96">
          <figure>
            <img src={decryption} alt="Shoes" className="w-48 h-48" />
          </figure>
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title font-mono text-black text-2xl h-6 w-24">
                <span>
                  <TypeAnimation
                    sequence={["Decrypt", 800, "", 300]}
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
                onChange={handleTextchange}
              ></textarea>
            ) : (
              <button
                className="btn glass btn-warning w-full h-10 rounded-xl shadow-lg shadow-gray-500 overflow-hidden text-black"
                onClick={handleFileChange}
              >
                {filePath != ""
                  ? `${filePath.split("\\").pop()}`
                  : "Choose File"}
              </button>
            )}
            <select
              className="select bg-amber-500 w-full max-w-xs uppercase text-black"
              onChange={(e) => {
                handleAlgoChange(e);
              }}
            >
              <option disabled selected className="lowercase">
                Select your algorithm!
              </option>
              {ChipherList.map((item) => (
                <option key={item.value}>{item.label}</option>
              ))}
            </select>
            <div>
              <input
                type="password"
                placeholder="Enter your Key"
                className="input input-bordered input-secondary w-full max-w-xs"
                onChange={(e) => {
                  setKey(e.target.value);
                }}
              />
            </div>
            <div className="card-actions justify-end">
              <button
                className="btn bg-slate-400 hover:bg-teal-400 w-full h-full rounded-lg text-black"
                onClick={async () => {
                  await decryptFile();
                  // window.my_modal_2.showModal();
                }}
              >
                Decrypt
              </button>
              <dialog id="my_modal_2" className="modal">
                <form method="dialog" className="modal-box">
                  <h3 className="font-bold text-lg">
                    {textOrFile === false
                      ? "File Decrypted Successfully"
                      : "Here is your decrypted text :"}
                  </h3>
                  <h3>{chiphertext}</h3>
                  <button
                    className="btn bg-green-500 text-black hover:bg-green-400 rounded-full mt-2"
                    onClick={() => {
                      const fileName = filePath
                        ?.split("\\")
                        .pop()
                        .replace(".enc", "");

                      invoke("showinfolder", {
                        filePath: fileName,
                      }).then((message) => {
                        console.log(message);
                        window.my_modal_2.showModal();
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encrypt;
