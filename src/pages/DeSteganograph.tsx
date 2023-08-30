import React, { FC, useEffect, useState } from "react";
import unsteg from "/desteganograph.png";
import { TypeAnimation } from "react-type-animation";
import { invoke } from "@tauri-apps/api/tauri";
import { open, save } from "@tauri-apps/api/dialog";

const DeSteganograph: FC = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [fileOrText, setFileOrText] = useState<boolean>(false);
  const [imgPath, setImgPath] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [savePath, setSavePath] = useState<string | null>("");

  useEffect(() => {
    setImgPath("");
    setData("");
    setPassword("");
    setSavePath("");
  }, []);

  const handleSubmit = async () => {
    if (fileOrText) {
      const filePath = await save({
        filters: [
          {
            name: "",
            extensions: ["*"],
          },
        ],
      });
      setSavePath(filePath);
    }
    invoke("desteganograph", {
      imgPath: imgPath,
      password: password,
      _fileortext: fileOrText,
      _finalpath: savePath,
    })
      .then((message) => {
        // setStegFilePath(message);
        //@ts-ignore
        window.my_modaldes_2.showModal();
        if (!fileOrText) {
          setData(message as string);
          console.log(message);
        }
      })
      .catch((error) => console.error(error));
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleImgChange = async () => {
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: "Image",
          extensions: ["png", "jpeg", "jpg", "ico", "svg", "gif"],
        },
      ],
    });
    if (selected === null) {
      // user cancelled the selection
    } else {
      // user selected a single file
      // console.log(selected);
      setImgPath(selected as string);
    }
  };
  return (
    <div className="w-screen h-screen font-mono">
      <div className="flex justify-center h-full items-center">
        <div className="card bg-amber-600 shadow-2xl rounded-lg pt-1 w-96">
          <figure>
            <img src={unsteg} alt="unsteg" className="w-48 h-48 p-1" />
          </figure>
          <div className="card-body">
            <div className="flex flex-row">
              <h2 className="card-title font-mono text-black text-2xl h-6 w-full">
                <span className="w-full">
                  <TypeAnimation
                    sequence={["De-Steganograph", 800, "", 300]}
                    speed={50}
                    repeat={Infinity}
                    wrapper="span"
                    cursor={false}
                  />
                </span>
              </h2>
              {/* <div>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-warning border-black"
                  onClick={() => {
                    setFileOrText((prev) => !prev);
                  }}
                />
              </div> */}
            </div>
            <div className="flex justify-center">
              <input
                className="input input-bordered textarea-warning w-full max-w-xs bg-slate-700 focus:bg-slate-600 placeholder:text-slate-300 rounded-lg font-mono text-black h-10 p-2 px-4"
                placeholder="Type your password here"
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
                  className="w-6 h-6 absolute bg-inherit text-black ml-80 mt-2"
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
                  className="w-6 h-6 absolute bg-inherit text-black ml-80 mt-2"
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
            </div>
            <label className="text-black bg-amber-500 rounded-lg shadow-2xl w-80">
              <span className="italic p-2">
                Choose the steganographed image:
              </span>
            </label>
            <button
              className="btn glass btn-warning w-full h-10 rounded-xl shadow-lg shadow-gray-500 overflow-hidden text-black"
              onClick={handleImgChange}
            >
              {imgPath != "" ? `${imgPath.split("\\").pop()}` : "Choose Image"}
            </button>

            <div className="card-actions justify-end">
              <button
                className="btn bg-slate-400 hover:bg-teal-400 w-full h-full rounded-lg text-black"
                type="submit"
                onClick={handleSubmit}
              >
                SUBMIT
              </button>
              <dialog id="my_modaldes_2" className="modal">
                <form method="dialog" className="modal-box">
                  <h3 className="font-bold text-lg ml-2">
                    De - Steganography Successful!
                  </h3>
                  <br />
                  <h3 className="italic ml-2 mb-1">Text found:</h3>
                  {/* <br /> */}
                  <span
                    className="textarea textarea-accent w-full text-white bg-slate-800 font-mono cursor-pointer ml-4"
                    onClick={(e) => {
                      if ((e.target as HTMLSpanElement).innerText !== "") {
                        navigator.clipboard.writeText(data);
                        let tmp = (e.target as HTMLSpanElement).innerText;
                        (e.target as HTMLSpanElement).innerText =
                          "copied to clipboard..";
                        setTimeout(() => {
                          (e.target as HTMLSpanElement).innerText = data;
                        }, 900);
                      }
                    }}
                  >
                    {data}
                  </span>

                  {/* <button
                    className="btn bg-green-500 text-black hover:bg-green-400 rounded-full mt-2"
                    onClick={() => {
                      const ffilePath = stgFilePath.split("\\");
                      const fileName = ffilePath.pop();
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
                  </button> */}
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

export default DeSteganograph;
