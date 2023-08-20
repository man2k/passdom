import { FC } from "react";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
// import { _default } from "react-type-animation";
// type SequenceElement =
//   | string
//   | number
//   | ((element: HTMLElement | null) => void | Promise<void>);

// type Sequence = Array<SequenceElement>;

interface ChipherListType {
  value: string;
  label: string;
}

interface prop {
  title?: string;
  checkbox?: boolean;
  textarea?: boolean;
  textbox?: boolean;
  select?: boolean;
  chipherList?: boolean;
  animation?: boolean;
  Img?: React.ReactNode;
  TextBox?: React.ReactNode;
  labelAboveBox?: React.ReactNode;
  labelBelowTitle?: React.ReactNode;
  ChooseFile?: React.ReactNode;
  TextArea?: React.ReactNode;
  Button?: React.ReactNode;
  ChipherList?: Array<ChipherListType>;
  TypeAnimationSequence?: any;
}

const CardC: FC<prop> = (prop: prop) => {
  const [textOrFile, setTextOrFile] = useState<boolean>(false);
  const [_encType, setEncType] = useState<string>("");
  // const [_isShown, _setIsShown] = useState<boolean>(false);

  return (
    <div className="card bg-amber-600 shadow-2xl rounded-lg pt-2 w-96">
      <figure>{prop.Img}</figure>
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="card-title font-mono text-black text-2xl h-6 w-full">
            <span>
              <TypeAnimation
                sequence={prop.TypeAnimationSequence}
                speed={50}
                repeat={Infinity}
                wrapper="span"
                cursor={false}
                omitDeletionAnimation={prop.animation}
              />
            </span>
          </h2>

          {prop.checkbox ? (
            <div>
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-warning border-black"
                onClick={() => {
                  setTextOrFile((prev) => !prev);
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        {prop.labelBelowTitle ? prop.labelBelowTitle : <></>}
        {textOrFile || prop.textarea ? (
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
        {prop.labelAboveBox ? prop.labelAboveBox : <></>}
        {prop.textbox ? prop.TextBox : <></>}
        {prop.select ? (
          <select
            className="select bg-amber-500 w-full max-w-xs uppercase text-black"
            onChange={(e) => {
              setEncType(e.target.value);
            }}
          >
            <option disabled selected className="lowercase">
              Select your algorithm!
            </option>
            {prop.ChipherList?.map((item) => (
              <option key={item.value}>{item.label}</option>
            ))}
          </select>
        ) : (
          <></>
        )}

        <div className="card-actions justify-end">
          <button className="btn bg-sky-300 hover:bg-teal-400 w-full h-full rounded-lg text-black">
            {prop.title}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardC;
