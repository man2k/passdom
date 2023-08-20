import { FC } from "react";

interface prop {
  imgData: string;
  title?: string;
}
const Img: FC<prop> = ({ imgData, title }) => {
  return (
    <>
      {/* {console.log(url)} */}
      <img src={imgData} alt={`${title}`} className="w-48 h-48 p-1" />
    </>
  );
};

export default Img;
