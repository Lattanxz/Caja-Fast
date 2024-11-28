import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/imgs/logo_transparent cut.png";
import { barItems } from "../assets/constants";
const Navbar = () => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const navigate = useNavigate(); // Hook de react-router-dom

  const toggleNavMenu = () => {
    setMobileMenuIsOpen(!mobileMenuIsOpen);
  };

  const handleNavigation = (type: string) => {
    navigate("/auth", { state: { type } }); // navegar con type
  };

  return (
    <nav className="sticky top-0 z-50 py-3 bg-orange-400 border-b border-orange-400">
      <div className="container px-12 mx-auto relative text-sm text-black">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img src={logo} alt="logo" className="w-20 mr-2" />
            <p className="text-xl tracking-tight text-black">CAJA FAST</p>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {barItems.map((item, index) => (
              <li key={index}>
                <a className="hover:opacity-75" href={item.href}>
                  {item.label}{" "}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <a
              onClick={() => handleNavigation("login")}
              className="py-2 px-3 border rounded-md border-black hover:opacity-75 cursor-pointer"
            >
              INICIAR SESIÓN
            </a>
            <a
              onClick={() => handleNavigation("register")}
              className="py-2 px-3 border rounded-md bg-gradient-to-r from-gray-400 to-gray-600 border-black hover:opacity-75 cursor-pointer"
            >
              REGISTRARSE
            </a>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavMenu}>
              {mobileMenuIsOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuIsOpen && (
          <div className="fixed right-0 z-20 bg-orange-400/90 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {barItems.map((item, index) => (
                <li key={index} className="py-4 ">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6 pt-2">
              <a
                onClick={() => handleNavigation("login")}
                className="py-2 px-3 border rounded-md border-black cursor-pointer"
              >
                Iniciar Sesión
              </a>
              <a
                onClick={() => handleNavigation("register")}
                className="py-2 px-3 rounded-md border bg-gradient-to-r from-gray-400 to-gray-600 border-black cursor-pointer"
              >
                Registrarse
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
