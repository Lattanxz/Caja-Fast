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

  interface Producto {
    id_producto: number;
    nombre_producto: string;
    precio_producto: number;
    cantidad: number;
  }

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
    | "crearCaja"
    | null
  >(null);
  const [listasDeProductos, setListasDeProductos] = useState<any[]>([]);
  const [selectedCaja, setSelectedCaja] = useState<number | null>(null);
  const [cajas, setCajas] = useState<any[]>([]); // Estado para las cajas del usuario
  const [productosCaja, setProductosCaja] = useState<any[]>([]); // Estado para los productos de la caja seleccionada
  const [productoNuevo, setProductoNuevo] = useState<string>(""); // Para manejar el input de agregar producto
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>(
    []
  );
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>("");
  const [cantidadProducto, setCantidadProducto] = useState<number>(1);
  const [cantidadAEliminar, setCantidadAEliminar] = useState<{
    [key: number]: number;
  }>({});
  const [nombreCaja, setNombreCaja] = useState("");
  const [fechaCaja, setFechaCaja] = useState("");
  const [estadoCaja, setEstadoCaja] = useState(false); // Inicializa con "false" si la caja no está abierta

  // 1. Llamar todas las cajas del usuario
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

  // 2. ver todos los productos de cada caja individual del usuario
  useEffect(() => {
    const fetchProductosCaja = async () => {
      if (selectedCaja && !productosCaja[selectedCaja]) {
        // Comprobamos si ya están cargados
        try {
          const response = await axios.get(
            `http://localhost:3000/api/boxes/${selectedCaja}/products`
          );
          // Guardamos los productos de la caja en el estado
          setProductosCaja((prevState) => ({
            ...prevState,
            [selectedCaja]: response.data.productos, // Guardar solo los productos
          }));
        } catch (error) {
          console.error("Error al obtener los productos de la caja:", error);
        }
      }
    };

    if (modalContent === "detalles" && selectedCaja) {
      fetchProductosCaja();
    }
  }, [modalContent, selectedCaja, productosCaja]);

  // 3. Ver todas las listas
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

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        setProductosDisponibles(response.data);
        console.log("Productos disponibles:", response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);
  /* Abrir modal según acción */
  const handleOpenModal = (
    type:
      | "agregar"
      | "detalles"
      | "gestionar"
      | "cargarLista"
      | "crearLista"
      | "agregarProductos"
      | "cerrarCaja"
      | "crearCaja",
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
      setCajas((prevCajas) => prevCajas.filter((caja) => caja.id !== cajaId)); // Actualiza el estado
    } catch (error) {
      console.error("Error al eliminar la caja:", error);
    }
  };

  /* Agregar un producto a la caja */
  const handleAgregarProducto = async () => {
    if (selectedCaja && productoSeleccionado && cantidadProducto > 0) {
      try {
        await axios.post(
          `http://localhost:3000/api/boxes/${selectedCaja}/products`,
          {
            id_producto: productoSeleccionado,
            cantidad: cantidadProducto, // Enviar la cantidad junto con el producto
          }
        );
        // Refrescar la lista de productos
        const response = await axios.get(
          `http://localhost:3000/api/boxes/${selectedCaja}/products`
        );
        setProductosCaja(response.data);
        setProductoSeleccionado(""); // Limpiar el select
        setCantidadProducto(1); // Limpiar la cantidad
      } catch (error) {
        console.error("Error al agregar el producto:", error);
      }
    } else {
      console.log("Por favor, selecciona un producto y una cantidad válida.");
    }
  };

  const handleEliminarProducto = async (
    productoId: number,
    cantidad: number
  ) => {
    // Verifica valores antes de la condición

    if (selectedCaja && productoId) {
      try {
        // Confirma los valores exactos que se enviarán en la URL
        const url = `http://localhost:3000/api/boxes/${selectedCaja}/products/${productoId}?cantidad=${cantidad}`;
        console.log("URL de la solicitud DELETE:", url);

        // Realiza la petición DELETE
        await axios.delete(url);

        console.log("Producto eliminado correctamente. Actualizando lista...");

        // Solicitud GET para actualizar productos
        const response = await axios.get(
          `http://localhost:3000/api/boxes/${selectedCaja}/products`
        );

        console.log(
          "Respuesta del servidor (productos actualizados):",
          response.data
        );
        setProductosCaja(response.data);
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    } else {
      console.log("selectedCaja o productoId no son válidos. Revisar valores.");
    }
  };

  const handleCrearCaja = async () => {
    try {
      const token = localStorage.getItem("token"); // O cómo estés almacenando el token

      // Convertir fechaCaja a timestamp
      const fechaTimestamp = new Date(fechaCaja).toISOString(); // O new Date(fechaCaja).getTime() si prefieres el timestamp numérico

      // Asegúrate de incluir el token en los headers
      const response = await axios.post(
        "http://localhost:3000/api/boxes/create",
        {
          nombre_caja: nombreCaja,
          fecha_apertura: fechaTimestamp, // Enviar la fecha correctamente
          estado: estadoCaja, // El estado de la caja
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Incluir el token en los headers
          },
        }
      );

      console.log("Caja creada:", response.data);
    } catch (error) {
      console.error("Error al crear la caja:", error);
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
            : modalContent === "crearCaja" // NUEVO
            ? "Crear Nueva Caja"
            : "Modal"
        }
      >
        {/* Contenido dinámico según el modal */}
        {modalContent === "agregar" && (
          <div className="space-y-4 p-4">
            <p className="mb-6 text-center">
              ELIGÍ UNA OPCIÓN PARA GESTIONAR TU PRÓXIMA CAJA
            </p>
            <button
              className="bg-orange-400 text-black w-full py-2 rounded hover:bg-orange-500"
              onClick={() => handleOpenModal("crearCaja")} // NUEVA OPCIÓN
            >
              CREAR UNA NUEVA CAJA
            </button>
            <button
              className="bg-orange-400 text-black w-full py-2 rounded-lg hover:bg-orange-500"
              onClick={() => handleOpenModal("cargarLista")}
            >
              CARGAR LISTA DE PRODUCTOS EXISTENTE
            </button>
            <button
              className="bg-orange-400 text-black w-full py-2 rounded-lg hover:bg-orange-500"
              onClick={() => handleOpenModal("crearLista")}
            >
              CREAR UNA NUEVA LISTA
            </button>
            <button
              className="bg-orange-400 text-black w-full py-2 rounded-lg hover:bg-orange-500"
              onClick={() => handleOpenModal("agregarProductos")}
            >
              AGREGAR PRODUCTOS MANUALMENTE
            </button>
          </div>
        )}

        {modalContent === "detalles" &&
          selectedCaja &&
          productosCaja[selectedCaja] && (
            <div>
              <h4 className="text-center font-semibold mb-2 pb-3">
                Productos en esta Caja
              </h4>
              <ul className="space-y-2 border-gray-300 border p-4 rounded-lg">
                {productosCaja[selectedCaja].length > 0 ? (
                  productosCaja[selectedCaja].map((producto: Producto) => (
                    <li
                      key={producto.id_producto}
                      className="text-center flex justify-between items-center"
                    >
                      <div>
                        {producto.nombre_producto} - {producto.cantidad}{" "}
                        unidades
                      </div>
                      <div className="flex items-center">
                        {/* Input para cantidad a eliminar */}
                        <input
                          type="number"
                          min="1"
                          max={producto.cantidad} // No permitir eliminar más de lo disponible
                          value={cantidadAEliminar[producto.id_producto] || ""} // Estado controlado
                          onChange={(e) =>
                            setCantidadAEliminar({
                              ...cantidadAEliminar,
                              [producto.id_producto]: Number(e.target.value),
                            })
                          }
                          className="w-16 border px-2 py-1 text-center text-black "
                        />
                        {/* Botón de eliminar */}
                        <button
                          onClick={() =>
                            handleEliminarProducto(
                              producto.id_producto,
                              cantidadAEliminar[producto.id_producto] || 1
                            )
                          }
                          className="text-red-500 hover:text-red-700 font-bold ml-2"
                        >
                          X
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-center">No hay productos en esta caja.</p>
                )}
              </ul>
            </div>
          )}
        {modalContent === "crearCaja" && (
          <div className="space-y-4 p-4">
            <h4 className="text-center font-semibold mb-2">Crear Nueva Caja</h4>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nombre de la caja"
                value={nombreCaja}
                onChange={(e) => setNombreCaja(e.target.value)}
                className="border rounded-lg px-4 py-2 text-black"
              />
              <input
                type="date"
                placeholder="Fecha de creación"
                value={fechaCaja}
                onChange={(e) => setFechaCaja(e.target.value)}
                className="border rounded-lg px-4 py-2 text-black"
              />

              {/* Checkbox para indicar si la caja está abierta */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={estadoCaja}
                  onChange={(e) => setEstadoCaja(e.target.checked)} // Cambia el estado de la caja
                  id="estadoCaja"
                />
                <label htmlFor="estadoCaja">Caja abierta</label>
              </div>

              <button
                onClick={handleCrearCaja}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Crear Caja
              </button>
            </div>
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
          <div className="p-4 max-w-lg mx-auto bg-black rounded-lg shadow-lg overflow-hidden">
            <h4 className="text-center font-semibold mb-2 pb-2">
              Agregar un nuevo producto
            </h4>
            <div className="flex flex-row mb-4 gap-4">
              <select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                className="px-4 py-2 rounded-l-lg border border-gray-300 text-black flex-grow"
                style={{ maxWidth: "250px" }} // Limita el tamaño máximo del select
              >
                <option value="">Selecciona un producto</option>
                {productosDisponibles.map((producto, index) => (
                  <option
                    key={producto.id_producto || `temp-${index}`}
                    value={producto.id_producto}
                  >
                    {producto.nombre_producto}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={cantidadProducto || ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue === "" || !isNaN(Number(newValue))) {
                    setCantidadProducto(newValue === "" ? 0 : Number(newValue)); // Asigna 0 si está vacío
                  }
                }}
                className="px-4 py-2 border border-gray-300 text-black flex-grow"
                placeholder="Cantidad"
                style={{ maxWidth: "100px" }} // Limita el tamaño máximo del input
              />
              <button
                onClick={handleAgregarProducto}
                className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600"
              >
                Agregar
              </button>
            </div>
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
                onClick={() => {
                  if (
                    window.confirm(
                      `¿Estás seguro que deseas eliminar la caja "${caja.nombre_caja}"?`
                    )
                  ) {
                    handleDeleteCaja(caja.id_caja);
                    alert(
                      `La caja "${caja.nombre_caja}" fue eliminada exitosamente.`
                    );
                  }
                }}
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
