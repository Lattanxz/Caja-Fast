import { PlusCircle, Trash2, Settings, Info, X } from "lucide-react";
import { useState } from "react";
import NavBar from "./Navbar";
import ModalReusable from "./ModalReusable";
import ModalLoadList from "./ModalLoadList";
import ModalCreateList from "./ModalCreateList";
import ModalAddProducts from "./ModalAddProducts";

const BoxesForm = () => {
  /* Estado para manejar los modales */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<
    | "agregar"
    | "detalles"
    | "gestionar"
    | "cargarLista"
    | "crearLista"
    | "agregarProductos"
    | "cerrarCaja"
    | null
  >(null);

  const handleProductsManagement = (
    opcion: "cargarLista" | "crearLista" | "agregarProductos"
  ) => {
    setModalContent(opcion);
  };

  const [listasPredeterminadas] = useState([
    { id: 1, nombre: "Lista Predeterminada 1" },
    { id: 2, nombre: "Lista Predeterminada 2" },
    { id: 3, nombre: "Lista Predeterminada 3" },
  ]);

  const [productsAvailable] = useState([
    "Producto A",
    "Producto B",
    "Producto C",
    "Producto D",
  ]);

  const [selectedCaja, setSelectedCaja] = useState<number | null>(null);

  /* Estado para registrar la última apertura de cada caja */
  const [cajas, setCajas] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      ultimaApertura: "XX-XX-XXXX",
    }))
  );

  /* Abrir modal según acción */
  const handleOpenModal = (
    type: "agregar" | "detalles" | "gestionar",
    cajaId?: number
  ) => {
    setModalContent(type);
    setSelectedCaja(cajaId || null);

    // Actualizar la última apertura al presionar "Ver Detalles" o "Gestionar"
    if (cajaId && (type === "detalles" || type === "gestionar")) {
      const fechaActual = new Date().toLocaleDateString(); // Fecha en formato DD/MM/AAAA
      setCajas((prevCajas) =>
        prevCajas.map((caja) =>
          caja.id === cajaId ? { ...caja, ultimaApertura: fechaActual } : caja
        )
      );
    }

    setIsModalOpen(true);
  };

  /* Cerrar modal */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setSelectedCaja(null);
  };

  /* Eliminar una caja específica */
  const handleDeleteCaja = (cajaId: number) => {
    setCajas((prevCajas) => prevCajas.filter((caja) => caja.id !== cajaId));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Barra de navegación */}
      <NavBar isLoggedIn={true} />

      {/* Título principal */}
      <header className="bg-black py-4">
        <div className="container px-12 mx-auto relative text-sm text-black">
          <div className="flex justify-between items-center">
            <h1 className="text-center text-white text-2xl font-bold">
              GESTIÓN DE CAJAS
            </h1>
            <button
              className="bg-orange-400 text-black px-4 py-2 rounded-lg flex items-center hover:bg-orange-500"
              onClick={() => handleOpenModal("agregar")}
            >
              AGREGAR CAJA
              <PlusCircle className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Modal */}
      <ModalReusable
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalContent === "agregar"
            ? "GESTIÓN DE PRODUCTOS"
            : modalContent === "cargarLista"
            ? "Cargar Lista de Productos"
            : modalContent === "crearLista"
            ? "Crear Nueva Lista"
            : modalContent === "agregarProductos"
            ? "Agregar Productos Manualmente"
            : modalContent === "detalles"
            ? `Detalles de la Caja ${selectedCaja}`
            : modalContent === "gestionar"
            ? `Gestionar Caja ${selectedCaja}`
            : "Modal"
        }
      >
        {/* Contenido dinámico según el modal */}
        {modalContent === "agregar" && (
          <div className="space-y-4 p-4">
            <p className="mb-6 text-center">
              ELIGÍ UNA OPCIÓN PARA GESTIONAR TUS CAJAS
            </p>
            <button
              className="bg-orange-400 text-black  w-full py-2 rounded hover:bg-orange-500"
              onClick={() => handleProductsManagement("cargarLista")}
            >
              CARGAR LISTA DE PRODUCTOS EXISTENTE
            </button>
            <button
              className="bg-orange-400 text-black w-full py-2 rounded-lg hover:bg-orange-500"
              onClick={() => handleProductsManagement("crearLista")}
            >
              CREAR NUEVA LISTA DE PRODUCTOS
            </button>
            <button
              className="bg-orange-400 text-black w-full py-2 rounded-lg hover:bg-orange-500"
              onClick={() => handleProductsManagement("agregarProductos")}
            >
              AGREGAR PRODUCTOS MANUALMENTE
            </button>
          </div>
        )}
        {modalContent === "detalles" && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-center">
              Productos en la caja
            </h3>
            <ul className="list-disc pl-4">
              <li className="py-1">Producto 1</li>
              <li className="py-1">Producto 2</li>
              <li className="py-1">Producto 3</li>
            </ul>
          </div>
        )}
        {modalContent === "gestionar" && (
          <div>
            <h3 className="text-lg font-bold mb-4 justify-center">
              Opciones de gestión
            </h3>
            <button className="bg-orange-400 text-black w-full py-2 rounded-lg hover:bg-orange-500 mb-4">
              Agregar Producto
            </button>
            <button className="bg-orange-400 text-black w-full py-2 rounded-lg hover:bg-orange-500">
              Eliminar Producto
            </button>
          </div>
        )}
        {modalContent === "cargarLista" && (
          <ModalLoadList
            listasPredeterminadas={listasPredeterminadas}
            onClose={handleCloseModal}
          />
        )}
        {modalContent === "crearLista" && (
          <ModalCreateList
            onSave={(name, products) => {
              console.log("Nueva lista creada:", name, products);
            }}
            onClose={handleCloseModal}
          />
        )}
        {modalContent === "agregarProductos" && (
          <ModalAddProducts
            productsAvailable={productsAvailable}
            onAddProducto={(products) => {
              console.log("Producto agregado:", products);
            }}
            onClose={handleCloseModal}
          />
        )}
      </ModalReusable>

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
                <button
                  className="bg-orange-400 text-black px-3 py-2 rounded-lg hover:bg-orange-500 flex items-center"
                  onClick={() => handleOpenModal("detalles", caja.id)}
                >
                  <Info className="w-4 h-4 mr-2" />
                  VER DETALLES
                </button>
                <button
                  className="bg-orange-400 text-black px-3 py-2 rounded-lg hover:bg-orange-500 flex items-center"
                  onClick={() => handleOpenModal("gestionar", caja.id)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  GESTIONAR
                </button>
              </div>
              <div className="flex space-x-2 mb-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                  onClick={() => handleDeleteCaja(caja.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  ELIMINAR
                </button>
                <button
                  className="bg-orange-400 text-black px-3 py-2 rounded-lg hover:bg-orange-500 flex items-center"
                  onClick={() => handleOpenModal("gestionar", caja.id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  CERRAR CAJA
                </button>
              </div>
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

export default BoxesForm;
