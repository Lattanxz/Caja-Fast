import { PlusCircle, Trash2, Settings, Info } from "lucide-react";
import LoggedBar from "./LoggedBar";

const CajaManagement = () => {
  const cajas = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    ultimaApertura: "XX-XX-XXXX",
  }));

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Barra de navegación */}
      <LoggedBar />

      {/* Título principal */}
      <header className="bg-black py-4">
        <div className="container px-12 mx-auto relative text-sm text-black">
          <div className="flex justify-between items-center">
            <h1 className="text-center text-white text-2xl font-bold">
              GESTIÓN DE CAJAS
            </h1>
            <button className="bg-orange-400 text-black px-4 py-2 rounded-lg flex items-center hover:bg-orange-500">
              AGREGAR CAJA
              <PlusCircle className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenedor de cajas */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cajas.map((caja) => (
            <div
              key={caja.id}
              className="bg-gray-200 border-2 border-orange-400 p-4 rounded-lg shadow-lg flex flex-col items-center"
            >
              <h3 className="text-lg font-bold mb-2">CAJA {caja.id}</h3>
              <p className="text-sm text-gray-600 mb-4">
                ULTIMA APERTURA: {caja.ultimaApertura}
              </p>
              <div className="flex space-x-2 mb-4">
                <button className="bg-orange-400 text-black px-3 py-2 rounded-lg hover:bg-orange-500 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  VER DETALLES
                </button>
                <button className="bg-orange-400 text-black px-3 py-2 rounded-lg hover:bg-orange-500 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  GESTIONAR
                </button>
              </div>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center">
                <Trash2 className="w-4 h-4 mr-2" />
                ELIMINAR
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-4 text-center">
        © 2024 Caja Fast - Todos los derechos reservados
      </footer>
    </div>
  );
};

export default CajaManagement;
