import logo from "../assets/imgs/logo_transparent cut.png";
import { CircleUserRound } from "lucide-react";

const LoggedBar = () => {
  return (
    <>
      <nav className="sticky top-0 z-50 py-3 bg-orange-400 border-b border-orange-400">
        <div className="container px-12 mx-auto relative text-sm text-black">
          <div className="flex justify-between items-center">
            <div className="flex items-center flex-shrink-0">
              <img src={logo} alt="logo" className="w-20 mr-2" />
              <p className="text-xl tracking-tight text-black">CAJA FAST</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-black p-2 rounded-full cursor-pointer">
                <CircleUserRound className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default LoggedBar;
