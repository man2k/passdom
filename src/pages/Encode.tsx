import { FC, ReactElement, useEffect, useState } from "react";
import encdec from "/encode.png";
import { TypeAnimation } from "react-type-animation";
// //@ts-ignore
import ZwspSteg from "zwsp-steg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Encode: FC = () => {
  const [data, setData] = useState<string>("");
  const [salt, setSalt] = useState<string>("");
  const [encodedText, setEncodedText] = useState<string>("");

  // useEffect(() => {
  //   setData("");
  //   setSalt("");
  // }, [encodedText]);

  const successMsgFile = (message: string) => (
    <div>
      <form>
        <h3 className="italic">Encoding Successful!</h3>

        <button
          className="btn bg-green-500 text-black hover:bg-green-400 rounded-full mt-2"
          onClick={(e) => {
            handleCopy(e, message);
          }}
        >
          click to copy
        </button>
      </form>
    </div>
  );
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

  const handleData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.target.value);
  };

  const handleSalt = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalt(e.target.value);
  };

  const handleCopy = (
    e: React.MouseEvent<HTMLButtonElement>,
    message: string
  ) => {
    e.preventDefault();
    navigator.clipboard.writeText(message);
    (e.target as HTMLInputElement).innerText = "copied to clipboard..";
    setTimeout(() => {
      (e.target as HTMLInputElement).innerText = "click to copy";
    }, 900);
  };

  const handleEncodedText = (s: string) => {
    setEncodedText(s);
  };

  const handleEncode = async () => {
    if (data === "" || salt === "") {
      errorToast("Some inputs are missing");
      return;
    }
    let encoded = ZwspSteg.encode(data, ZwspSteg.MODE_FULL);
    let finalStr = salt + encoded;
    handleEncodedText(finalStr);
    completedToastFile(finalStr);
  };

  return (
    <div className="w-screen h-screen font-mono">
      <div className="flex justify-center h-full grow items-center">
        <div className="card bg-base-100 shadow-base-300 shadow-xl rounded-lg pt-[0.2rem] w-96">
          <figure>
            <img src={encdec} alt="Shoes" className="w-48 h-44" />
          </figure>
          <div className="card-body">
            <div className="flex flex-row">
              <h2 className="card-title font-mono text-2xl h-6 w-full">
                <span className="text-shadow-lg shadow-accent w-full">
                  <TypeAnimation
                    sequence={[
                      "Encode",
                      800,
                      "Invisible",
                      800,
                      "Invisible Encoding:",
                      500,
                    ]}
                    speed={50}
                    repeat={Infinity}
                    wrapper="span"
                    cursor={false}
                  />
                </span>
              </h2>
            </div>
            <textarea
              className="textarea textarea-accent w-full max-w-xs bg-accent font-mono text-accent-content placeholder:text-accent-content h-10 shadow-xl shadow-base-300 placeholder:font-semibold"
              placeholder="Enter your secret text here"
              onChange={handleData}
            ></textarea>

            <div className="flex justify-center w-[320px]">
              <input
                className="input input-accent w-full max-w-xs bg-accent font-mono h-10 p-3 mt-1 placeholder:text-accent-content text-accent-content shadow-xl shadow-base-300"
                placeholder="Enter your cover text here"
                type="text"
                onChange={handleSalt}
              />
            </div>

            <div className="card-actions justify-end">
              <button
                className="btn bg-success hover:bg-accent-focus w-full h-full text-accent-content placeholder:text-accent-content mt-0.5 shadow-xl shadow-base-300"
                type="submit"
                onClick={handleEncode}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encode;
