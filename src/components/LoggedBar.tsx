import logo from "../assets/imgs/logo_transparent cut.png";
import HomeButton from "./HomeButton";
import ProfileMenu from "./ProfileMenu";

const LoggedBar = () => {
  return (
    <>
      <nav className="sticky top-0 z-50 py-3 bg-orange-400 border-b border-orange-400">
        <div className="container px-12 mx-auto relative text-sm text-black">
          <div className="flex justify-between items-center">
            <HomeButton>
              <div className="flex items-center flex-shrink-0">
                <img src={logo} alt="logo" className="w-20 mr-2" />
                <p className="text-xl tracking-tight text-black">CAJA FAST</p>
              </div>
            </HomeButton>
            <div className="flex items-center space-x-4">
              {/* Menú de perfil */}
              <ProfileMenu />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default LoggedBar;
