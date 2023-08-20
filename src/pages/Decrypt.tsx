import { FC } from "react";
import decryption from "../assets/decryption.png";
import { ChipherList } from "../constants";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Encrypt: FC = () => {
  const [textOrFile, setTextOrFile] = useState<boolean>(false);
  const [_decType, setDncType] = useState<string>("");

  return (
    <div className="w-screen h-screen font-mono">
      <div className="flex justify-center h-full items-center">
        <div className="card bg-amber-600 shadow-2xl rounded-lg pt-3 w-96">
          <figure>
            <img src={decryption} alt="Shoes" className="w-48 h-48" />
          </figure>
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title font-mono text-black text-2xl h-6 w-24">
                <span>
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
                  className="checkbox checkbox-sm checkbox-warning border-black"
                  onClick={() => {
                    setTextOrFile((prev) => !prev);
                  }}
                />
              </div>
            </div>
            {textOrFile ? (
              <textarea
                className="textarea textarea-warning w-full max-w-xs bg-slate-500 rounded-lg font-mono text-black h-10"
                placeholder="Type here"
              ></textarea>
            ) : (
              <input
                type="file"
                className="file-input file-input-error w-full max-w-xs bg-slate-500 rounded-lg font-mono text-black"
              />
            )}
            <select
              className="select bg-amber-500 w-full max-w-xs uppercase text-black"
              onChange={(e) => {
                setDncType(e.target.value);
              }}
            >
              <option disabled selected className="lowercase">
                Select your algorithm!
              </option>
              {ChipherList.map((item) => (
                <option key={item.value}>{item.label}</option>
              ))}
            </select>

            <div className="card-actions justify-end">
              <button className="btn bg-slate-400 hover:bg-teal-400 w-full h-full rounded-lg text-black">
                Decrypt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encrypt;
