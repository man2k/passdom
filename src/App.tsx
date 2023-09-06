import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Home, Encrypt, Decrypt, Steganograph, DeSteganograph } from "./pages";
import { FC, useEffect, useState } from "react";
import Encode from "./pages/Encode";
import Decode from "./pages/Decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { themes } from "./constants";

const App: FC = () => {
  const [theme, setTheme] = useState<string>("dracula");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dracula";
    setTheme(storedTheme);
  }, []);

  const handleTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
    localStorage.setItem("theme", e.target.value);
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
              className="select select-accent select-sm hidden md:flex mt-3.5 ml-[1350px] fixed bg-inherit w-[100px] border-1"
              defaultValue={theme}
              onChange={handleTheme}
            >
              <option
                disabled
                className="bg-accent text-accent-content border-0 mt-2"
              >
                {theme}
              </option>
              {themes.map((the) => (
                <option
                  key={the}
                  className="bg-accent text-accent-content border-0 mt-2"
                >
                  {the}
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
            <Route key="home" path="/" element={<Home />} />
            <Route key="encrypt" path="/encrypt" element={<Encrypt />} />
            <Route key="decrypt" path="/decrypt" element={<Decrypt />} />
            <Route
              key="steganograph"
              path="/steganograph"
              element={<Steganograph />}
            />
            <Route
              key="desteganograph"
              path="/desteganograph"
              element={<DeSteganograph />}
            />
            <Route key="encode" path="/encode" element={<Encode />} />
            <Route key="decode" path="/decode" element={<Decode />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
