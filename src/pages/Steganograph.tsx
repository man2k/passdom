import { FC, ReactElement, useEffect, useState } from "react";
import steg from "/steganograph.png";
import { TypeAnimation } from "react-type-animation";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Steganograph: FC = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [fileOrText, setFileOrText] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>("");
  const [stgFilePath, setStegFilePath] = useState<string>("");
  const [imgPath, setImgPath] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // useEffect(() => {
  //   setFilePath("");
  //   setData("");
  // }, []);
  const successMsgFile = (stgFilePath: string) => (
    <div>
      <form>
        <h3 className="italic">Steganography Successful!</h3>
        <button
          className="btn bg-green-500 text-black hover:bg-green-400 rounded-full mt-2"
          onClick={(e) => {
            e.preventDefault();
            // console.log(stgFilePath);
            // const ffilePath = stgFilePath.split("\\");
            // const fileName = ffilePath.pop();
            // console.log(fileName);
            // const fp =
            //   ffilePath.join("\\") + "\\" + fileName + ".enc";
            // console.log(fp);
            invoke("showinfolder", {
              fileName: "",
              filePath: stgFilePath,
            });
            // .then((message) => {
            // console.log(message);
            // window.my_modalstg_2.showModal();
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
  const completedToastFile = (message: string) => {
    // console.log("Toast");
    toast.success(successMsgFile(message), {
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

  const handleData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.target.value);
  };
  const handleStegPath = (message: string) => {
    setStegFilePath(message as string);
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

  const handleFileChange = async () => {
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

  const handleSubmit = async () => {
    if (imgPath === "" || password === "" || data === "") {
      errorToast("Some inputs are missing");
      return;
    }
    progressToast("Steganograph in progress..");
    invoke("steganograph", {
      imgPath: imgPath,
      data: data,
      password: password,
      filePath: filePath,
    })
      .then((message) => {
        console.log(message);
        handleStegPath(message as string);
        // //@ts-ignore
        // window.my_modalstg_2.showModal();
        completedToastFile(message as string);
        // console.log(message);
      })
      .catch((error) => {
        if (error == "encryption failed") {
          errorToast(
            <div>
              <h4 className="text-base">Invalid image chosen.</h4>
              <h5 className="text-sm">
                Chosen image doesn't contain any secret.
              </h5>
            </div>
          );
        } else {
          errorToast(
            <div>
              <h4 className="text-base">{error}</h4>
            </div>
          );
        }
      });
  };

  return (
    <div className="w-screen h-screen font-mono">
      <div className="flex justify-center h-full grow items-center">
        <div className="card bg-base-100 shadow-base-300 shadow-xl rounded-lg pt-[0.2rem] w-auto">
          <figure>
            <img src={steg} alt="Shoes" className="w-48 h-44 p-2" />
          </figure>
          <div className="card-body">
            <div className="flex flex-row">
              <h2 className="card-title font-mono text-2xl h-6 w-full">
                <span className="text-shadow-lg shadow-accent w-full">
                  <TypeAnimation
                    sequence={["Steganograph", 600, "", 200]}
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
            {!fileOrText ? (
              <textarea
                className="textarea textarea-accent w-full max-w-xs bg-accent font-mono text-accent-content placeholder:text-accent-content h-10 shadow-xl shadow-base-300 placeholder:font-semibold"
                placeholder="Enter your secret text here..."
                onChange={handleData}
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
            <form className="flex justify-center">
              <input
                className="input input-accent w-full max-w-xs bg-accent font-mono h-10 p-3 mt-1 placeholder:text-accent-content text-accent-content shadow-xl shadow-base-300"
                placeholder="Enter your password here"
                type={isShown ? "text" : "password"}
                onChange={handlePassword}
              />
              {password != "" ? (
                isShown ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 absolute bg-transparent font-extrabold ml-[320px] mt-3"
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
                    className="w-6 h-6 absolute bg-transparent font-extrabold ml-[320px] mt-3"
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
                )
              ) : (
                <></>
              )}
            </form>

            <div className="w-[320px]">
              {/* <input
                type="file"
                className="file-input file-input-error w-full max-w-xs bg-slate-500 rounded-lg font-mono text-black hidden"
              /> */}
              <button
                className="btn btn-accent w-full h-10 shadow-lg shadow-base-300 overflow-hidden"
                onClick={handleImgChange}
              >
                {imgPath != "" ? (
                  `${imgPath.split("\\").pop()}`
                ) : (
                  <span className="italic p-2 font-bold">Choose an Image:</span>
                )}
              </button>
            </div>

            <div className="card-actions justify-end">
              <button
                className="btn bg-success hover:bg-accent-focus w-full h-full text-accent-content placeholder:text-accent-content mt-0.5 shadow-xl shadow-base-300"
                type="submit"
                onClick={handleSubmit}
              >
                SUBMIT
              </button>
              {/* <dialog id="my_modalstg_2" className="modal">
                <form method="dialog" className="modal-box">
                  <h3 className="font-bold text-lg">
                    Steganography Successful.
                  </h3>

                  <button
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
                        // window.my_modalstg_2.showModal();
                      });
                    }}
                  >
                    Show in folder
                  </button>
                </form>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Steganograph;
