const StateBar = () => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 py-3 bg-orange-400 border-t border-orange-400">
      <div className="container px-12 mx-auto relative text-sm text-black">
        <div className="flex justify-center">
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-4xl sm:text-2xl lg:text-4xl tracking-tight text-black">
              LA MEJOR MANERA DE CERRAR DE TUS CAJAS
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StateBar;
