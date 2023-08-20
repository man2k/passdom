import { FC } from "react";
import encryption from "../assets/encryption.png";
import decryption from "../assets/decryption.png";
import steg from "../assets/steg.png";
import desteg from "../assets/unsteg.png";
import encdec from "../assets/encdec.png";
interface CardProp {
  title: string;
}

const Card: FC<CardProp> = ({ title }) => {
  return (
    <div className="card bg-base-200 w-96 h-72 shadow-xl rounded-xl mx-5 drop-shadow-lg">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl">{title}</h2>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        {title === "Encrypt" ? (
          <img src={encryption} alt="Encrypt" className="w-48 h-48 p-2" />
        ) : (
          <></>
        )}
        {title === "Decrypt" ? (
          <img src={decryption} alt="Decrypt" className="w-48 h-48 p-2" />
        ) : (
          <></>
        )}
        {title === "Steganograph" ? (
          <img src={steg} alt="Steganograph" className="w-48 h-48 p-2" />
        ) : (
          <></>
        )}
        {title === "De-Steganograph" ? (
          <img src={desteg} alt="De-Steganograph" className="w-48 h-48 p-2" />
        ) : (
          <></>
        )}
        {title === "Encode" ? (
          <img src={encdec} alt="Encode" className="w-48 h-48 p-2" />
        ) : (
          <></>
        )}
        {title === "Decode" ? (
          <img src={encdec} alt="Decode" className="w-48 h-48 p-2 rotate-180" />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Card;
