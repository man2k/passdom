import { FC, ReactElement, useEffect, useState } from "react";
import encdec from "/encode.png";
import { TypeAnimation } from "react-type-animation";
//@ts-ignore
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
    let encoded = ZwspSteg.encode(data, ZwspSteg.MODE_FULL);
    let finalStr = salt + encoded;
    handleEncodedText(finalStr);
    completedToastFile(finalStr);
    //@ts-ignore
    // window.my_modalenco_2.showModal();
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
              className="textarea textarea-warning text-base w-full max-w-xs bg-slate-700 focus:bg-slate-600 placeholder:text-slate-300 rounded-lg font-mono text-black h-10"
              placeholder="Enter your secret text here"
              onChange={handleData}
            ></textarea>

            <div className="flex justify-center w-[320px]">
              <input
                className="input input-bordered textarea-warning w-full max-w-xs bg-slate-700 focus:bg-slate-600 placeholder:text-slate-300 rounded-lg font-mono text-black h-10 p-2 px-4"
                placeholder="Enter your cover text here"
                type="text"
                onChange={handleSalt}
              />
            </div>

            <div className="card-actions justify-end">
              <button
                className="btn bg-slate-400 hover:bg-teal-400 w-full h-full rounded-lg text-black"
                type="submit"
                onClick={handleEncode}
              >
                SUBMIT
              </button>
              {/* <dialog id="my_modalenco_2" className="modal">
                <form method="dialog" className="modal-box">
                  <h3 className="font-bold text-lg">Encoding Successful.</h3>

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

export default Encode;
