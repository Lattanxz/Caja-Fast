import logo from "../assets/imgs/logo_transparent cut.png";

const Body = () => {
  return (
    <div className="relative z-10 flex flex-col h-full justify-between">
      {/* Barra de estado */}
      {/* Contenedor del texto y logo */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center text-center lg:text-left px-4 lg:px-20 pb-24">
        {/* Texto principal */}
        <h1 className=" text-5xl sm:text-6xl lg:text-8xl mr-1 font-normal text-black leading-tight text-pretty px -20">
          GESTIONA TUS CAJAS CON RAPIDEZ Y PRECISIÓN
        </h1>

        {/* Logo */}
        <img
          src={logo}
          alt="logo caja fast"
          className="mt-6 lg:mt-0 lg:ml-8 w-1/5 sm:w-1/4 lg:w-1/3"
        />
      </div>
    </div>
  );
};

export default Body;
