import { FC, ReactElement, useEffect, useState } from "react";
import encdec from "/decode.png";
import { TypeAnimation } from "react-type-animation";
//@ts-ignore
import ZwspSteg from "zwsp-steg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Decode: FC = () => {
  const [data, setData] = useState<string>("");
  const [decodedText, setDecodedText] = useState<string>("");

  // useEffect(() => {
  //   setData("");
  // }, [decodedText]);

  const successMsgFile = (message: string) => (
    <div>
      <form>
        <h3 className="italic">Decoding Successful!</h3>

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
    let decoded = ZwspSteg.decode(data, ZwspSteg.MODE_FULL);
    if (decoded != "") {
      handleDecodedText(decoded);
      completedToastFile(decoded);
    } else {
      errorToast("No encoded text found!");
    }

    //@ts-ignore
    // window.my_modaldeco_2.showModal();
  };

  return (
    <div className="w-screen h-screen font-mono">
      <div className="flex justify-center h-full grow items-center">
        <div className="card bg-amber-600 shadow-2xl rounded-lg pt-[0.2rem] w-auto">
          <figure>
            <img src={encdec} alt="Shoes" className="w-48 h-44 p-2" />
          </figure>
          <div className="card-body">
            <div className="flex flex-row">
              <h2 className="card-title font-mono text-black text-2xl h-6 w-full">
                <span className="w-full">
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
            <textarea
              className="textarea textarea-warning text-base w-[320px] max-w-xs bg-slate-700 focus:bg-slate-600 placeholder:text-slate-300 rounded-lg font-mono text-black h-10"
              placeholder="Enter your secret text here"
              onChange={handleData}
            ></textarea>

            <div className="card-actions justify-end">
              <button
                className="btn bg-slate-400 hover:bg-teal-400 w-full h-full rounded-lg text-black"
                type="submit"
                onClick={handleDecode}
              >
                SUBMIT
              </button>
              {/* <dialog id="my_modaldeco_2" className="modal">
                <form method="dialog" className="modal-box">
                  <h3 className="font-bold text-lg">Decoding Successful.</h3>

                  <button
                    className="btn bg-green-500 text-black hover:bg-green-400 rounded-full mt-2"
                    onClick={handleCopy}
                  >
                    click to copy
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

export default Decode;
