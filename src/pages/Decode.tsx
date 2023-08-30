import { FC, useEffect, useState } from "react";
import encdec from "/decode.png";
import { TypeAnimation } from "react-type-animation";
//@ts-ignore
import ZwspSteg from "zwsp-steg";

const Decode: FC = () => {
  const [data, setData] = useState<string>("");
  const [decodedText, setDecodedText] = useState<string>("");

  useEffect(() => {
    setData("");
  }, []);

  const handleData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.target.value);
  };

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(decodedText);
    (e.target as HTMLElement).innerText = "copied to clipboard..";
    setTimeout(() => {
      (e.target as HTMLElement).innerText = "click to copy";
    }, 900);
  };

  const handleDecode = async () => {
    let decoded = ZwspSteg.decode(data, ZwspSteg.MODE_FULL);
    setDecodedText(decoded);
    //@ts-ignore
    window.my_modaldeco_2.showModal();
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
              <dialog id="my_modaldeco_2" className="modal">
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
              </dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decode;
