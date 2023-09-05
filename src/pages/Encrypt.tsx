import { FC, ReactElement, useEffect, useState } from "react";
import encryption from "/encrypt.png";
import { ChipherList } from "../constants";
import { TypeAnimation } from "react-type-animation";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import CryptoJS from "crypto-js";
// import fileDownload from "js-file-download";

declare global {
  interface Window {
    my_modalenc_4: HTMLFormElement;
  }
}

const Encrypt: FC = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [textOrFile, setTextOrFile] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const [chiphertext, setChiphertext] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [algo, setAlgo] = useState<number>(0);
  const [password, setPassword] = useState<string>("");

  const successMsgFile = (fp: string) => (
    <div>
      <form>
        <h3 className="italic">File Encryption Successfull !</h3>
        <button
          className="btn btn-success btn-xs text-accent-content hover:bg-accent-focus mt-2 text-xs"
          onClick={(e) => {
            e.preventDefault();
            console.log(fp);
            // const ffilePath = fp.split("\\");
            // const fileName = ffilePath.pop() + ".enc";
            // const fp =
            //   ffilePath.join("\\") + "\\" + fileName + ".enc";
            // console.log(fp);
            invoke("showinfolder", {
              fileName: "",
              filePath: fp,
            });
            // .then((message) => {
            //   console.log(message);
            //   // window.my_modalenc_2.showModal();
            // });
          }}
        >
          Show in folder
        </button>
      </form>
    </div>
  );

  const progressToast = (msg: string | ReactElement) => {
    // console.log("Toast");
    toast.info(msg, {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const errorToast = (e: string | ReactElement) => {
    // console.log("Toast");
    toast.warn(e, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const completedToastFile = (fp: string) => {
    // console.log("Toast");
    toast.success(successMsgFile(fp), {
      position: "bottom-left",
      autoClose: 15000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  useEffect(() => {
    setFilePath("");
    setText("");
  }, [textOrFile]);

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleTextchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleCopy = (e: React.MouseEvent<HTMLInputElement>) => {
    if ((e.target as HTMLInputElement).value !== "") {
      navigator.clipboard.writeText(chiphertext);
      // let tmp = e.target.innerText;
      (e.target as HTMLInputElement).value = "copied to clipboard..";
      setTimeout(() => {
        (e.target as HTMLInputElement).value = chiphertext;
      }, 900);
    }
  };

  const encryptFile = async () => {
    if ((filePath == "" && text == "") || password == "" || algo == 0) {
      errorToast("Some inputs are missing");
    } else if (textOrFile === false) {
      progressToast("Encryption in progress");
      invoke("encryptfile", {
        filePath: filePath,
        fileName: filePath?.split("\\").pop() + ".enc",
        password: password,
        algo: algo,
      })
        .then(() => {
          completedToastFile(filePath);
          // // @ts-ignore
          // window.my_modalenc_2.showModal();
        })
        .catch((message) => {
          if (message == "encryption failed") {
            errorToast(
              <div>
                <h4 className="text-sm">Encryption has failed</h4>
              </div>
            );
          } else {
            console.log(message);
          }
        });
    } else if (textOrFile === true) {
      progressToast("Encryption in progress");
      invoke("encrypttext", {
        textStr: text,
        password: password,
        algo: algo,
      })
        .then((message) => {
          // console.log(message);
          setChiphertext(message as string);
          // // @ts-ignore
          window.my_modalenc_4.showModal();
        })
        .catch((message) => {
          if (message == "encryption failed") {
            errorToast(
              <div>
                <h4 className="text-sm">Encryption has failed</h4>
              </div>
            );
          } else {
            console.log(message);
          }
        });
    }
  };

  const handleFileChange = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const selected = await open({
      multiple: false,
    });

    if (selected === null) {
      // user cancelled the selection
    } else {
      // user selected a single file
      setFilePath(selected as string);
    }
  };

  const handleAlgoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        <div className="card bg-base-100 border-1 border-accent-content shadow-base-300 shadow-xl rounded-lg pt-2 w-96">
          <figure>
            <img src={encryption} alt="Shoes" className="w-48 h-52" />
          </figure>
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title font-mono text-2xl h-6 w-24">
                <span className="text-shadow-lg shadow-accent">
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
                  className="checkbox checkbox-sm checkbox-accent shadow-xl shadow-base-300"
                  onClick={() => {
                    setTextOrFile((prev) => !prev);
                  }}
                />
              </div>
            </div>
            {textOrFile ? (
              <textarea
                className="textarea textarea-accent w-full max-w-xs bg-accent font-mono text-accent-content placeholder:text-accent-content h-10 shadow-xl shadow-base-300 placeholder:font-semibold"
                placeholder="Type here..."
                onChange={handleTextchange}
              ></textarea>
            ) : (
              <button
                className="btn btn-accent w-full h-10 shadow-lg shadow-base-300 overflow-hidden"
                onClick={handleFileChange}
              >
                {filePath != ""
                  ? `${filePath.split("\\").pop()}`
                  : "Choose File"}
              </button>
            )}
            <form className="flex flex-row">
              <input
                className="input input-accent w-full max-w-xs bg-accent font-mono h-10 p-3 mt-1 placeholder:text-accent-content text-accent-content shadow-xl shadow-base-300"
                placeholder="Enter your password here.."
                type={isShown ? "text" : "password"}
                onChange={handlePassword}
              />
              {isShown ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 absolute bg-inherit font-extrabold ml-[309px] mt-3"
                  onClick={() => {
                    setIsShown((prev) => !prev);
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 absolute bg-inherit font-extrabold ml-[309px] mt-3"
                  onClick={() => {
                    setIsShown((prev) => !prev);
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </form>
            <select
              className="select select-accent bg-accent w-full max-w-xs uppercase text-accent-content placeholder:text-accent-content shadow-xl shadow-base-300 mt-0.5"
              onChange={(e) => {
                handleAlgoChange(e);
              }}
              defaultValue="Select your algorithm!"
            >
              <option
                key="default"
                disabled
                className="lowercase text-accent-content"
              >
                Select your algorithm!
              </option>
              {ChipherList.map((item) => (
                <option key={item.value}>{item.label}</option>
              ))}
            </select>

            <div className="card-actions justify-end">
              <button
                className="btn bg-success hover:bg-accent-focus w-full h-full text-accent-content placeholder:text-accent-content mt-0.5 shadow-xl shadow-base-300"
                // disabled={algo != 0 && filePath != "" ? false : true}
                onClick={encryptFile}
              >
                Encrypt
              </button>
              <dialog id="my_modalenc_4" className="modal">
                <form method="dialog" className="modal-box">
                  <h3 className="font-bold text-lg">Encryption Successful!</h3>
                  <div className="py-4 flex-col">
                    Encrypted Text:
                    <input
                      type="text"
                      value={chiphertext}
                      readOnly
                      className="input input-success w-full max-w-xs ml-1 mt-2 shadow-lg shadow-violet-700 border-0 bg-accent cursor-pointer text-accent-content"
                      onClick={handleCopy}
                    />
                    <div className="mt-5 ml-14">
                      <span className="text-xs italic ml-72 shadow-lg border-2 border-gray-500 rounded-full p-1 cursor-default">
                        click to copy
                      </span>
                    </div>
                  </div>
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
