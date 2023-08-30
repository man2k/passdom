import Card from "../components/Card";
import { FC } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { navLinks } from "../constants/index";

const Home: FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className=" w-full justify-center">
        <div className="flex justify-center pb-2">
          <div className="card text-8xl flex flex-row font-extralight font-mono">
            <TypeAnimation
              sequence={[
                ".ENCRYPT.",
                800,
                ".DECRYPT.",
                800,
                ".STEGANOGRAPH.",
                800,
                ".DE STEGANOGRAPH.",
                800,
                ".ENCODE.",
                800,
                ".DECODE.",
                800,
              ]}
              // omitDeletionAnimation={true}
              speed={50}
              deletionSpeed={70}
              repeat={Infinity}
              wrapper="h1"
              cursor={false}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center my-10">
        <div className="flex flex-wrap justify-center gap-12">
          {navLinks.map((item) => (
            <div key={item.title}>
              <Link to={`/${item.id}`}>
                <Card title={item.title} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
