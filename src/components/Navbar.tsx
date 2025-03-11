import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/imgs/logo_transparent cut.png";
import ProfileMenu from "./ProfileMenu";
import HomeButton from "./HomeButton";

interface NavbarProps {
  isLoggedIn?: boolean;
  userRole?: number;
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

  const renderAdminLinks = () => {
    return (
      <>
        <li className="hover:cursor-pointer">
          <a
            className="hover:opacity-75"
            onClick={() => handleOtherNavigation("/users")}
          >
            Usuarios
          </a>
        </li>
      </>
    );
  };

  const renderUserLinks = () => {
    return (
      <li className="hover:cursor-pointer">
        <a
          className="hover:opacity-75"
          onClick={() => handleOtherNavigation("/boxes")}
        >
          Cajas
        </a>
      </li>
    );
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
            {isLoggedIn && userRole !== undefined && (
              <>
                {userRole === 2 && renderAdminLinks()}
                {userRole === 1 && renderUserLinks()}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
