import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/imgs/logo_transparent cut.png";
import { barItems } from "../assets/constants";
import ProfileMenu from "./ProfileMenu";
import HomeButton from "./HomeButton";

interface NavbarProps {
  isLoggedIn?: boolean;
  userRole?: string;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, userRole }) => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNavMenu = () => {
    setMobileMenuIsOpen(!mobileMenuIsOpen);
  };

  const handleNavigation = (type: string) => {
    navigate("/auth", { state: { type } });
  };

  const handleOtherNavigation = (href: string) => {
    if (href !== "#") navigate(href);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 bg-orange-400 border-b border-orange-400">
      <div className="container px-12 mx-auto relative text-sm text-black">
        <div className="flex justify-between items-center">
          <HomeButton>
            <div className="flex items-center flex-shrink-0">
              <img src={logo} alt="logo" className="w-20 mr-2" />
              <p className="text-xl tracking-tight text-black cursor-default">
                CAJA FAST
              </p>
            </div>
          </HomeButton>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {barItems.map((item, index) => (
              <li key={index} className="hover:cursor-pointer">
                <a
                  className="hover:opacity-75"
                  onClick={() => handleOtherNavigation(item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {/* Mostrar "Usuarios" y "Cajas" solo si el rol es "administrador" */}
            {userRole === "administrador" && (
              <>
                <li className="hover:cursor-pointer">
                  <a
                    className="hover:opacity-75"
                    onClick={() => handleOtherNavigation("/usuarios")}
                  >
                    Usuarios
                  </a>
                </li>
                <li className="hover:cursor-pointer">
                  <a
                    className="hover:opacity-75"
                    onClick={() => handleOtherNavigation("/cajas")}
                  >
                    Cajas
                  </a>
                </li>
              </>
            )}
          </ul>
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            {isLoggedIn ? (
              <ProfileMenu />
            ) : (
              <>
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
              </>
            )}
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
                <li key={index} className="py-4">
                  <a onClick={() => handleOtherNavigation(item.href)}>
                    {item.label}
                  </a>
                </li>
              ))}
              {/* Mostrar "Usuarios" y "Cajas" en el menú móvil solo si el rol es "administrador" */}
              {userRole === "administrador" && (
                <>
                  <li className="py-4">
                    <a
                      className="hover:opacity-75"
                      onClick={() => handleOtherNavigation("/usuarios")}
                    >
                      Usuarios
                    </a>
                  </li>
                  <li className="py-4">
                    <a
                      className="hover:opacity-75"
                      onClick={() => handleOtherNavigation("/cajas")}
                    >
                      Cajas
                    </a>
                  </li>
                </>
              )}
            </ul>
            <div className="flex space-x-6 pt-2">
              {isLoggedIn ? (
                <ProfileMenu />
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
