import CardC from "../components/CardC";
import { FC } from "react";
import Img from "../components/Img";
import TextBox from "../components/TextBox";
import encdec from "../assets/encdec.png";
// import { dirname } from "path";

// import * as path from "path";

const Encode: FC = () => {
  return (
    <div className="w-screen h-screen font-mono">
      <div className="flex justify-center h-full items-center">
        {/* {console.log(path.relative("../assets/decode.png"))} */}
        <CardC
          Img={<Img imgData={encdec} title="Encode" />}
          title="Encode"
          textarea={true}
          TypeAnimationSequence={[
            "Encode",
            800,
            "Invisible",
            800,
            "Invisible Encoding:",
            500,
          ]}
          labelBelowTitle={
            <label className="text-black bg-amber-500 rounded-lg shadow-2xl w-full p-2">
              <span className="italic p-2 pl-0">Input your secret:</span>
            </label>
          }
          labelAboveBox={
            <label className="text-black bg-amber-500 rounded-lg shadow-2xl w-full p-2">
              <span className="italic p-2 pl-0 whitespace-pre-wrap">
                Input any salt or random words you want your secret mixed in:
              </span>
            </label>
          }
          textbox={true}
          TextBox={<TextBox placeholder="Input any salt" />}
        />
      </div>
    </div>
  );
};

export default Encode;
