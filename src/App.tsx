import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Home, Encrypt, Decrypt, Steganograph, DeSteganograph } from "./pages";
import { FC, useState } from "react";
import Encode from "./pages/Encode";
import Decode from "./pages/Decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { themes } from "./constants";

const App: FC = () => {
  const [theme, setTheme] = useState<string>("luxury");

  const handleTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  return (
    <div
      data-theme={theme}
      className="min-w-full min-h-screen whitespace-nowrap overflow-hidden"
    >
      <div className="flex justify-center items-center w-full">
        <div className="xl:max-w-[1920px] w-full flex">
          <Navbar>
            <select
              className="select select-accent flex ml-[1150px] absolute mt-2 bg-inherit p-2s w-[100px] rounded-full border-0 text-slate-300"
              onChange={handleTheme}
            >
              <option
                disabled
                selected
                className="bg-gray-800 text-white border-0 mt-2"
              >
                {theme}
              </option>
              {themes.map((theme) => (
                <option className="bg-gray-800 text-white border-0 mt-2">
                  {theme}
                </option>
              ))}
            </select>
          </Navbar>
        </div>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={1000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="mt-16">
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/encrypt" element={<Encrypt />} />
            <Route path="/decrypt" element={<Decrypt />} />
            <Route path="/steganograph" element={<Steganograph />} />
            <Route path="/desteganograph" element={<DeSteganograph />} />
            <Route path="/encode" element={<Encode />} />
            <Route path="/decode" element={<Decode />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
