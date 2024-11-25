import { socialItems } from "../assets/constants";

const BottomBar = () => {
  return (
    <nav className="py-3 bg-orange-400 border-t border-orange-400">
      <div className="container px-12 mx-auto relative text-sm text-black">
        <div className="flex justify-between items-center">
          <a
            href={socialItems[0].href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-75"
          >
            <img
              src={socialItems[0].image}
              alt={socialItems[0].alt}
              className="w-12 h-12"
            />
          </a>

          <div className="text-center">
            <p className="text-sm font-semibold">
              © 2024 CajaFast. Todos los derechos reservados.
            </p>
          </div>
          <a
            href={socialItems[1].href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-75"
          >
            <img
              src={socialItems[1].image}
              alt={socialItems[1].alt}
              className="w-12 h-12"
            />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default BottomBar;
