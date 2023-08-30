import { FC, useEffect, useState } from "react";
import encdec from "/encode.png";
import { TypeAnimation } from "react-type-animation";
//@ts-ignore
import ZwspSteg from "zwsp-steg";

const Encode: FC = () => {
  const [data, setData] = useState<string>("");
  const [salt, setSalt] = useState<string>("");
  const [encodedText, setEncodedText] = useState<string>("");

  useEffect(() => {
    setData("");
    setSalt("");
  }, []);

  const handleData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.target.value);
  };

  const handleSalt = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalt(e.target.value);
  };

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(encodedText);
    (e.target as HTMLInputElement).innerText = "copied to clipboard..";
    setTimeout(() => {
      (e.target as HTMLInputElement).innerText = "click to copy";
    }, 900);
  };

  const handleEncode = async () => {
    let encoded = ZwspSteg.encode(data, ZwspSteg.MODE_FULL);
    let finalStr = salt + encoded;
    setEncodedText(finalStr);
    //@ts-ignore
    window.my_modalenco_2.showModal();
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
              <dialog id="my_modalenco_2" className="modal">
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
              </dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encode;
