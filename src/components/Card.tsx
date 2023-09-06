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
  const styl = "w-48 h-48 p-2 drop-shadow-[7px_7px_5px_hsl(var(--s))]";
  return (
    <div className="card card-compact bg-base-200 w-96 h-72 shadow-lg shadow-base-300 rounded-xl mx-5 drop-shadow-lg">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl font-sans uppercase">{title}</h2>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        {title === "Encrypt" ? (
          <img src={encryption} alt="Encrypt" className={styl} />
        ) : (
          <></>
        )}
        {title === "Decrypt" ? (
          <img src={decryption} alt="Decrypt" className={styl} />
        ) : (
          <></>
        )}
        {title === "Steganograph" ? (
          <img src={steg} alt="Steganograph" className={styl} />
        ) : (
          <></>
        )}
        {title === "De-Steganograph" ? (
          <img src={desteg} alt="De-Steganograph" className={styl} />
        ) : (
          <></>
        )}
        {title === "Encode" ? (
          <img src={encdec} alt="Encode" className={styl} />
        ) : (
          <></>
        )}
        {title === "Decode" ? (
          <img src={encdec} alt="Decode" className={styl + " rotate-180"} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Card;
