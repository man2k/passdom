import { FC, ReactElement, useEffect, useState } from "react";
import encdec from "/decode.png";
import { TypeAnimation } from "react-type-animation";
// // @ts-ignore
import ZwspSteg from "zwsp-steg";
// const ZwspSteg = require("zwsp-steg");
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Decode: FC = () => {
  const [data, setData] = useState<string>("");
  const [decodedText, setDecodedText] = useState<string>("");

  useEffect(() => {
    setDecodedText("");
  }, []);

  const successMsgFile = (message: string) => (
    <div>
      <form>
        <h3 className="italic">Decoding Successful !</h3>

        <button
          className="btn btn-success btn-xs text-accent-content hover:bg-accent-focus mt-2 text-xs"
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

  const handleDecodedText = (message: string) => {
    setDecodedText(message);
  };

  const handleDecode = async () => {
    if (data === "") {
      errorToast("The input is missing");
      return;
    }
    let decoded = ZwspSteg.decode(data, ZwspSteg.MODE_FULL);
    if (decoded != "") {
      handleDecodedText(decoded);
      completedToastFile(decoded);
    } else {
      errorToast("No encoded text found!");
    }
  };

  return (
    <div className="w-screen h-screen font-mono">
      <div className="flex justify-center h-full grow items-center">
        <div className="card bg-base-100 shadow-base-300 shadow-xl rounded-lg pt-[0.2rem] w-96">
          <figure>
            <img src={encdec} alt="Shoes" className="w-48 h-44 mb-2" />
          </figure>
          <div className="card-body flex">
            <div className="flex flex-row">
              <h2 className="card-title font-mono text-2xl h-6 w-full">
                <span className="text-shadow-lg shadow-accent">
                  <TypeAnimation
                    sequence={[
                      "Decode",
                      800,
                      "Invisible",
                      800,
                      "Invisible Decoding:",
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
            <div className="flex flex-col gap-3 mt-2">
              <textarea
                className="textarea textarea-accent max-w-xs bg-accent font-mono text-accent-content placeholder:text-accent-content h-10 shadow-xl shadow-base-300 placeholder:font-semibold"
                placeholder="Enter your secret text here"
                onChange={handleData}
              ></textarea>

              <div className="card-actions justify-end">
                <button
                  className="btn bg-success hover:bg-accent-focus w-full h-full text-accent-content placeholder:text-accent-content mt-2 shadow-xl shadow-base-300"
                  type="submit"
                  onClick={handleDecode}
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decode;
