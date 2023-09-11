import { FC, ReactElement, useEffect, useState } from "react";
import decryption from "/decrypt.png";
import { ChipherList } from "../constants";
import { TypeAnimation } from "react-type-animation";
import { invoke } from "@tauri-apps/api/tauri";
import { message, open } from "@tauri-apps/api/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

declare global {
  interface Window {
    my_modaldec_2: HTMLFormElement;
  }
}

const Decrypt: FC = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [textOrFile, setTextOrFile] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const [chiphertext, setChiphertext] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [algo, setAlgo] = useState<number>(0);

  const successMsgFile = (fp: string) => (
    <div>
      <form>
        <h3 className="italic">File Decryption Successful !</h3>

        {!textOrFile ? (
          <button
            className="btn btn-success btn-xs text-accent-content hover:bg-accent-focus mt-2 text-xs"
            onClick={(e) => {
              e.preventDefault();
              // console.log(fp);
              invoke("showinfolder", {
                fileName: fp.split("\\").pop()?.replace(".enc", ""),
                filePath: "",
              });
            }}
          >
            Show in folder
          </button>
        ) : (
          <></>
        )}
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

  const handleAlgoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "aes-128-cbc") {
      setAlgo(128);
    } else if (e.target.value === "aes-192-cbc") {
      setAlgo(192);
    } else if (e.target.value === "aes-256-cbc") {
      setAlgo(256);
    }
  };
  const decryptFile = async () => {
    // //@ts-ignore
    const fileName = filePath.split("\\").pop()?.replace(".enc", "");
    if ((filePath == "" && text == "") || password == "" || algo == 0) {
      errorToast("Some inputs are missing");
    } else if (textOrFile === false) {
      progressToast("Decryption in progress");
      invoke("decryptfile", {
        filePath: filePath,
        fileName: fileName,
        password: password,
        algo: algo,
      })
        .then((message) => {
          // console.log(message);
          completedToastFile(filePath);
          // //@ts-ignore
          // window.my_modaldec_2.showModal();
        })
        .catch((message) => {
          if (message == "decryption failed") {
            errorToast(
              <div>
                <h4 className="text-sm">Decryption has failed</h4>
                <h5 className="text-xs">Check your password and try again</h5>
              </div>
            );
          } else if (message === "couldn't open file") {
            <div>
              <h4 className="text-sm">
                Couldn't open or file the file selected
              </h4>
            </div>;
          } else {
            console.log(message);
          }
        });
    } else if (textOrFile === true) {
      // console.log(text);
      // console.log(password);
      progressToast("Decryption in progress..");
      invoke("decrypttext", {
        text: text,
        password: password,
        algo: algo,
      })
        .then((message) => {
          // console.log(message);
          setChiphertext(message as string);
          // completedToastFile();
          // // @ts-ignore
          window.my_modaldec_2.showModal();
        })
        .catch((message) => {
          // console.log(message);
          if (message == "decryption failed") {
            errorToast(
              <div>
                <h4 className="text-sm">Decryption has failed</h4>
                <h5 className="text-xs">
                  Check your password and type and try again
                </h5>
              </div>
            );
          } else if (message == "format error") {
            errorToast(
              <div>
                <h4 className="text-sm">
                  Invalid input. Not a valid encrypted text
                </h4>
                <h5 className="text-xs">Check your input and try again</h5>
              </div>
            );
          } else {
            console.log(message);
          }
        });
    }
  };

  const handleTextchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // console.log("where is the txt", text);
  };

  const handleCopy = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if ((e.target as HTMLInputElement).innerText !== "") {
      navigator.clipboard.writeText(chiphertext);
      // let tmp = e.target.innerText;
      (e.target as HTMLInputElement).innerText = "copied to clipboard..";
      setTimeout(() => {
        (e.target as HTMLInputElement).innerText = chiphertext;
      }, 900);
    }
  };

  const handleFileChange = async () => {
    const selected = await open({
      multiple: false,
    });

    if (selected === null) {
    } else {
      setFilePath(selected as string);
    }
  };
  return (
    <div className="w-screen h-screen font-mono">
      <div className="flex justify-center h-full items-center">
        <div className="card bg-base-100 border-1 border-accent-content shadow-base-300 shadow-xl rounded-lg pt-3 w-96">
          <figure>
            <img src={decryption} alt="Shoes" className="w-48 h-48 mb-3" />
          </figure>
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title font-mono text-2xl h-6 w-24">
                <span className="text-shadow-lg shadow-accent">
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
                  className="checkbox checkbox-sm checkbox-accent shadow-xl shadow-base-300"
                  onClick={() => {
                    setTextOrFile((prev) => !prev);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {textOrFile ? (
                <textarea
                  className="textarea textarea-accent w-full max-w-xs bg-accent font-mono text-accent-content placeholder:text-accent-content h-10 shadow-xl shadow-base-300 placeholder:font-semibold"
                  placeholder="Type here"
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
                  type={isShown ? "text" : "password"}
                  placeholder="Enter your password here"
                  className="input input-accent w-full max-w-xs bg-accent font-mono h-10 p-3 placeholder:text-accent-content text-accent-content shadow-xl shadow-base-300"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                {isShown ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 absolute bg-inherit font-extrabold ml-[309px] mt-2"
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
                    className="w-6 h-6 absolute bg-inherit font-extrabold ml-[309px] mt-2"
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
                className="select select-accent bg-accent w-full max-w-xs uppercase text-accent-content placeholder:text-accent-content shadow-xl shadow-base-300"
                onChange={(e) => {
                  handleAlgoChange(e);
                }}
                defaultValue="Select your algorithm!"
              >
                <option disabled key="default" className="lowercase">
                  Select your algorithm!
                </option>
                {ChipherList.map((item) => (
                  <option key={item.value}>{item.label}</option>
                ))}
              </select>
              <div className="card-actions justify-end">
                <button
                  className="btn bg-success hover:bg-accent-focus w-full h-full text-accent-content placeholder:text-accent-content mt-2 shadow-xl shadow-base-300"
                  onClick={decryptFile}
                >
                  Decrypt
                </button>

                <dialog id="my_modaldec_2" className="modal">
                  <form method="dialog" className="modal-box">
                    <h3 className="font-bold text-lg">
                      Here is your decrypted text :
                    </h3>
                    <h3
                      className="bg-slate-700 hover:bg-slate-600 rounded-lg w-max px-2 py-1 mt-2 ml-3 cursor-pointer"
                      onClick={handleCopy}
                    >
                      {chiphertext}
                    </h3>
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
    </div>
  );
};

export default Decrypt;
