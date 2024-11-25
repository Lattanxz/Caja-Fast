import logo from "../assets/imgs/logo_transparent cut.png";

const Body = () => {
  return (
    <div className="relative z-10 flex flex-row items-center mt-2 lg:mt-20">
      <div className="">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl mr-1 -tracking-normal text-pretty px-20">
          GESTIONA TUS CAJAS CON RAPIDEZ Y PRECISIÓN
        </h1>
      </div>
      <img
        src={logo}
        alt="logo caja fast"
        className="w-1/4 lg:w-1/2 sm:w-1/8"
      />
    </div>
  );
};

export default Body;
