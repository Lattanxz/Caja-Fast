import { PlusCircle, Trash2, Settings, Info } from "lucide-react";
import { useState, useEffect } from "react";
import NavBar from "./Navbar";
import ModalReusable from "./ModalReusable";
import ModalLoadList from "./ModalLoadList";
import ModalCreateList from "./ModalCreateList";
import ModalAddProducts from "./ModalAddProducts";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BoxesForm = () => {
  const { userId } = useAuth(); // Obtener el userId del contexto

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
  const [listasDeProductos, setListasDeProductos] = useState<any[]>([]);
  const [selectedCaja, setSelectedCaja] = useState<number | null>(null);
  const [cajas, setCajas] = useState<any[]>([]); // Estado para las cajas del usuario
  const [productosCaja, setProductosCaja] = useState<any[]>([]); // Estado para los productos de la caja seleccionada
  const [productoNuevo, setProductoNuevo] = useState<string>(""); // Para manejar el input de agregar producto

  /* Fetch de cajas desde el backend */
  useEffect(() => {
    const fetchCajas = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/boxes/users/${userId}`
        );
        setCajas(response.data); // Asignar las cajas obtenidas del backend
      } catch (error) {
        console.error("Error al obtener las cajas:", error);
      }
    };
    if (userId) fetchCajas(); // Llamar solo si userId está definido
  }, [userId]);

  /* Fetch de productos cuando se abre el modal de detalles */
  useEffect(() => {
    const fetchProductosCaja = async () => {
      if (selectedCaja) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/boxes/${selectedCaja}/products`
          );
          setProductosCaja(response.data); // Asignar los productos obtenidos del backend
        } catch (error) {
          console.error("Error al obtener los productos de la caja:", error);
        }
      }
    };
    if (modalContent === "detalles" && selectedCaja) {
      fetchProductosCaja();
    }
  }, [modalContent, selectedCaja]); // Solo se ejecuta cuando se abre el modal de detalles

  useEffect(() => {
    const fetchListas = async () => {
      if (modalContent === "cargarLista" && userId) {
        try {
          // Asegurémonos de pasar el userId en la URL
          const response = await axios.get(
            `http://localhost:3000/api/lists/${userId}` // Se pasa correctamente el userId
          );
          setListasDeProductos(response.data);
        } catch (error) {
          console.error("Error al obtener las listas de productos:", error);
        }
      }
    };

    fetchListas();
  }, [modalContent, userId]); // Dependencia: modalContent y userId

  /* Abrir modal según acción */
  const handleOpenModal = (
    type:
      | "agregar"
      | "detalles"
      | "gestionar"
      | "cargarLista"
      | "crearLista"
      | "agregarProductos"
      | "cerrarCaja",
    cajaId?: number
  ) => {
    setModalContent(type);
    setSelectedCaja(cajaId || null);
    setIsModalOpen(true);
    console.log(modalContent);

    if (type === "cargarLista" && userId) {
      console.log(type);
      console.log("id del que carga la lista", userId);
      // Cargar las listas de productos específicas del usuario
      const fetchListas = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/lists/${userId}` // Pasa el userId como parte de la ruta
          );
          setListasDeProductos(response.data); // Asignar las listas obtenidas
        } catch (error) {
          console.error("Error al obtener las listas de productos:", error);
        }
      };
      fetchListas();
    }
  };

  /* Cerrar modal */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setSelectedCaja(null);
    setProductosCaja([]); // Limpiar los productos al cerrar el modal
    setProductoNuevo(""); // Limpiar el campo de nuevo producto
  };

  /* Eliminar una caja específica */
  const handleDeleteCaja = async (cajaId: number) => {
    if (!cajaId) {
      console.error("ID de caja inválido:", cajaId);
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/boxes/${cajaId}`);
      setCajas((prevCajas) => prevCajas.filter((caja) => caja.id !== cajaId));
    } catch (error) {
      console.error("Error al eliminar la caja:", error);
    }
  };

  /* Agregar un producto a la caja */
  const handleAgregarProducto = async () => {
    if (selectedCaja && productoNuevo.trim() !== "") {
      try {
        await axios.post(
          `http://localhost:3000/api/boxes/${selectedCaja}/products`,
          {
            nombre_producto: productoNuevo,
          }
        );
        // Refrescar la lista de productos
        const response = await axios.get(
          `http://localhost:3000/api/boxes/${selectedCaja}/products`
        );
        setProductosCaja(response.data);
        setProductoNuevo(""); // Limpiar el input
      } catch (error) {
        console.error("Error al agregar el producto:", error);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Barra de navegación */}
      <NavBar isLoggedIn={true} />

      {/* Título principal */}
      <header className="bg-black py-4">
        <div className="container px-12 mx-auto text-sm text-black">
          <div className="flex justify-between items-center">
            <h1 className="text-center text-white text-2xl font-bold">
              GESTIÓN DE CAJAS (Usuario ID: {userId})
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
              onClick={() => handleOpenModal("cargarLista")}
            >
              CARGAR LISTA DE PRODUCTOS EXISTENTE
            </button>
            <button
              className="bg-orange-400 text-black w-full py-2 rounded-lg hover:bg-orange-500"
              onClick={() => handleOpenModal("crearLista")}
            >
              CREAR NUEVA LISTA DE PRODUCTOS
            </button>
            <button
              className="bg-orange-400 text-black w-full py-2 rounded-lg hover:bg-orange-500"
              onClick={() => handleOpenModal("agregarProductos")}
            >
              AGREGAR PRODUCTOS MANUALMENTE
            </button>
          </div>
        )}
        {modalContent === "detalles" && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-center">
              Detalles de la Caja
            </h3>
            <h4 className="text-center font-semibold mb-2">
              Productos en esta Caja
            </h4>
            <ul className="space-y-2">
              {productosCaja.length > 0 ? (
                productosCaja.map((producto) => (
                  <li key={producto.id} className="text-center">
                    {producto.nombre_producto} - {producto.cantidad} unidades
                  </li>
                ))
              ) : (
                <p className="text-center">No hay productos en esta caja.</p>
              )}
            </ul>
          </div>
        )}
        {modalContent === "cargarLista" && (
          <ModalLoadList onClose={handleCloseModal} />
        )}

        {modalContent === "crearLista" && (
          <ModalCreateList onClose={handleCloseModal} />
        )}

        {modalContent === "agregarProductos" && (
          <ModalAddProducts onClose={handleCloseModal} />
        )}

        {modalContent === "gestionar" && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-center">
              Gestionar Caja {selectedCaja}
            </h3>
            <h4 className="text-center font-semibold mb-2">
              Agregar un nuevo producto
            </h4>
            <div className="flex mb-4">
              <input
                type="text"
                value={productoNuevo}
                onChange={(e) => setProductoNuevo(e.target.value)}
                className="px-4 py-2 rounded-l-lg border border-gray-300"
                placeholder="Nombre del producto"
              />
              <button
                onClick={handleAgregarProducto}
                className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600"
              >
                Agregar
              </button>
            </div>
            <h4 className="text-center font-semibold mb-2">
              Productos en esta Caja
            </h4>
            <ul className="space-y-2">
              {productosCaja.length > 0 ? (
                productosCaja.map((producto) => (
                  <li key={producto.id} className="text-center">
                    {producto.nombre_producto} - {producto.cantidad} unidades
                  </li>
                ))
              ) : (
                <p className="text-center">No hay productos en esta caja.</p>
              )}
            </ul>
          </div>
        )}
      </ModalReusable>

      {/* Contenedor de cajas */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cajas.map((caja, index) => (
            <div
              key={caja.id || `caja-${index}`}
              className="bg-gray-200 border-2 border-orange-400 p-4 rounded-lg shadow-lg flex flex-col items-center"
            >
              <h3 className="text-lg font-bold mb-2">{caja.nombre_caja}</h3>
              <p className="text-sm text-gray-600 mb-2">
                FECHA DE CREACIÓN:{" "}
                {new Date(caja.fecha_apertura).toLocaleDateString()}
              </p>
              <div className="flex space-x-2 mb-4">
                <button
                  className="bg-orange-400 text-black px-3 py-2 rounded-lg hover:bg-orange-500 flex items-center"
                  onClick={() => handleOpenModal("detalles", caja.id_caja)}
                >
                  <Info className="w-4 h-4 mr-2" />
                  VER DETALLES
                </button>
                <button
                  className="bg-orange-400 text-black px-3 py-2 rounded-lg hover:bg-orange-500 flex items-center"
                  onClick={() => handleOpenModal("gestionar", caja.id_caja)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  GESTIONAR
                </button>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                onClick={() => handleDeleteCaja(caja.id_caja)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                ELIMINAR
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BoxesForm;
