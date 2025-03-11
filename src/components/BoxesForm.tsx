import { PlusCircle, Trash2, Settings, Info, ChartNoAxesCombined } from "lucide-react";
import { useState, useEffect } from "react";
import NavBar from "./Navbar";
import ModalReusable from "./ModalReusable";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {Producto} from "../types/index";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";
import { Today } from "@mui/icons-material";

interface List {
  id_lista: number;
  nombre_lista: string;
}

const BoxesForm = () => {
  const { userId, isLoggedIn, userRole, token  } = useAuth(); // Obtener el userId del contexto
  
  /* Inicio de contantes y estados */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<
    | "agregar"
    | "eliminarCaja"
    | "detalles"
    | "gestionar"
    | "cargarLista"
    | "crearLista"
    | "agregarProductos"
    | "gestionarProductos"
    | "gestionarListas"
    | "cerrarCaja"
    | "crearCaja"
    | null
  >(null);
  const [listasDeProductos, setListasDeProductos] = useState<any[]>([]);
  const [selectedCaja, setSelectedCaja] = useState<number | null>(null);
  const [cajas, setCajas] = useState<any[]>([]); 
  const [productosCaja, setProductosCaja] = useState<any[]>([]);
  const [productoNuevo, setProductoNuevo] = useState<string>(""); 
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>(
    []
  );
  const [nombreCaja, setNombreCaja] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [fechaCaja, setFechaCaja] = useState(today);
  const [estadoCaja, setEstadoCaja] = useState(true); 
  const [cargando, setCargando] = useState(true);
  const [listaSeleccionada, setListaSeleccionada] = useState<string | "">("");
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [lists, setLists] = useState<List[]>([]);

/* Final de constantes y estados */

/* Fetch inicio */

const navigate = useNavigate();
  // 1. Llamar todas las cajas del usuario
  /* Fetch de cajas desde el backend con useEffects */
  const fetchCajas = async () => {
    setCargando(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/boxes/users/${userId}`);
      setCajas(response.data); // Ahora siempre será un array (vacío o con datos)
    } catch (error) {
      console.error("Error al obtener las cajas:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!userId) return; 
    fetchCajas(); 
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
 
  const fetchListas = async () => {
    try {
      if (!userId || !token) return; // Evitar hacer la solicitud si no hay usuario o token
  
      const response = await axios.get<List[]>("http://localhost:3000/api/lists", {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en los headers
        },
        params: {
          id_usuario: userId, // Enviar el userId en los parámetros
        },
      });
  
      console.log("Datos obtenidos:", response.data);
      setListasDeProductos(response.data); // Ahora usa el estado correcto
    } catch (error) {
      console.error("Error al obtener las listas:", error);
    }
  };
  
  useEffect(() => {
    fetchListas();
  }, [userId]);
  
  const fetchProductos = async () => {
    const  id_usuario = userId; // Obtener el id_usuario desde el AuthContext
  
    try {
      const response = await axios.get("http://localhost:3000/api/products", {
        headers: {
          "X-User-ID": id_usuario, // Agregar id_usuario como encabezado
        },
      });
      setProductosDisponibles(response.data);
      console.log("Productos disponibles:", response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };
  
  useEffect(() => {
    fetchProductos();
  }, []);

   
  useEffect(() => { 
    const fetchBoxesProducts = async () => {
      const  id_usuario = useAuth(); // Obtener el id_usuario desde el AuthContext
  
      try {
        const response = await fetch("http://localhost:3000/api/products", {
          headers: {
            "X-User-ID": String(id_usuario), // Convertir id_usuario a string
          },
        });
  
        if (!response.ok) throw new Error("Error al obtener productos");
  
        const data: Producto[] = await response.json();
        setProductosCaja(data);
      } catch (error) {
        console.error(error);
        alert("Error al cargar productos");
      }
    };
  
    fetchBoxesProducts();
  }, []);

/* Fetch fin */

/* Inicio de Handles */

  /* Abrir modal según acción */
  const handleOpenModal = (
    type:
      | "agregar"
      | "eliminarCaja"
      | "gestionar"
      | "cargarLista"
      | "crearLista"
      | "cerrarCaja"
      | "crearCaja"
      | "gestionarListas",
    cajaId?: number
  ) => {
    setModalContent(type);
    setSelectedCaja(cajaId || null);
    setIsModalOpen(true);
    console.log(modalContent);

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
      fetchCajas();
    } catch (error) {
      console.error("Error al eliminar la caja:", error);
    }
  };

  


  /* Crear caja */
  const handleCrearCaja = async () => {
    if (!listaSeleccionada) {
      toast.error("Debes seleccionar una lista de productos antes de crear la caja.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const fechaTimestamp = new Date(fechaCaja).toISOString().split("T")[0];
  
      const estado = estadoCaja ? "abierto" : "cerrado";
  
      const response = await axios.post(
        "http://localhost:3000/api/boxes/create",
        {
          nombre_caja: nombreCaja,
          fecha_apertura: fechaTimestamp,
          estado: estado,
          id_lista: listaSeleccionada, // 🔹 Ahora enviamos la lista seleccionada
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Caja creada:", response.data);
  
      const idCajaCreada = response.data.id_caja;
  
      navigate(`/sales/${idCajaCreada}`, { state: { id_lista: listaSeleccionada } });
  
      setNombreCaja("");
      setFechaCaja("");
      setEstadoCaja(true);
      setListaSeleccionada("");
  
      fetchCajas();
      toast.success("Caja creada correctamente");
    } catch (error) {
      console.error("Error al crear la caja:", error);
      toast.error("Hubo un error al crear la caja. Inténtalo nuevamente.");
    }
  };
  
  const handleGestionar = (id_caja: string) => {
    navigate(`/sales/${id_caja}`, { state: { id_lista: listaSeleccionada } });
  };
  
  const obtenerIdUsuarioDesdeToken = (token: string): number => {
    try {
      // Divide el token en sus partes: header, payload y signature
      const [, payloadBase64] = token.split(".");
  
      if (!payloadBase64) {
        throw new Error("Token no válido: falta el payload");
      }
  
      // Decodifica el payload (en base64) a una cadena JSON
      const payloadJson = atob(payloadBase64);
  
      // Convierte la cadena JSON a un objeto JavaScript
      const payload = JSON.parse(payloadJson);
  
      // Extrae el id_usuario del payload
      const id_usuario = payload.id_usuario;
  
      if (!id_usuario) {
        throw new Error("No se encontró el id_usuario en el token");
      }
  
      return id_usuario;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      throw new Error("No se pudo obtener el id_usuario desde el token");
    }
  };
  

  const handleBoxProductos = async (nombreCaja: string, productosSeleccionados: Producto[]) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    // Obtén el id_usuario desde el token
    const id_usuario = obtenerIdUsuarioDesdeToken(token);

    console.log("Nombre de la caja:", nombreCaja);
    console.log("Productos seleccionados:", productosSeleccionados);

    // Verifica que todos los productos tengan una cantidad válida
    const productosConCantidad = productosSeleccionados.map((producto) => {
      if (!producto.cantidad || producto.cantidad < 1) {
        throw new Error(`La cantidad del producto ${producto.nombre_producto} no es válida`);
      }
      return producto;
    });

    // 1. Crear la caja en la base de datos
    const cajaResponse = await fetch("http://localhost:3000/api/boxes/create", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre_caja: nombreCaja,
        id_usuario: id_usuario,
        fecha_apertura: new Date().toISOString(), // Fecha actual en formato ISO
        estado: true, // Estado por defecto
        productos: productosConCantidad, // Envía los productos con cantidad
      }),
    });

    if (!cajaResponse.ok) {
      const errorResponse = await cajaResponse.json();
      console.error("Error al crear la caja:", errorResponse);
      throw new Error("Error al crear la caja");
    }

    const cajaData = await cajaResponse.json();
    const id_caja = cajaData.id_caja; // Extrae el id_caja de la respuesta

    if (!id_caja) {
      throw new Error("No se recibió el id_caja desde el backend");
    }

    console.log("Caja creada con éxito. ID de la caja:", id_caja);

    // 2. Agregar productos a la caja en producto_caja
    for (const producto of productosConCantidad) {
      console.log("Datos enviados para agregar producto:", {
        id_caja,
        id_producto: producto.id_producto,
        cantidad: producto.cantidad,
      });

      const productoCajaResponse = await fetch("http://localhost:3000/api/boxProducts", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_caja,
          id_producto: producto.id_producto,
          cantidad: producto.cantidad,
        }),
      });

      if (!productoCajaResponse.ok) {
        const errorResponse = await productoCajaResponse.json();
        console.error(`Error al agregar el producto ${producto.nombre_producto} a la caja:`, errorResponse);
        throw new Error(`Error al agregar el producto ${producto.nombre_producto} a la caja`);
      }
    }

    console.log("Caja y productos agregados con éxito");
    setProductosCaja([]); // Limpiar la selección de productos
    fetchCajas();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      alert(error.message || "Hubo un problema al guardar la caja y los productos");
    } else {
      console.error("Ocurrió un error inesperado:", error);
      alert("Hubo un problema al guardar la caja y los productos");
    }
  }
};

const handleViewDetails = (id_caja: number) => {
  setSelectedBox(id_caja);
};
/* Fin de los handles */

  return (
  <div className="flex flex-col min-h-screen bg-gray-100">
    {/* Barra de navegación */}
    <NavBar isLoggedIn={isLoggedIn} userRole={userRole ?? undefined} />

    {/* Título principal */}
    <header className="bg-black py-4">
      <div className="container px-12 mx-auto text-sm text-black">
        <div className="flex justify-between items-center">
          <h1 className="text-center text-white text-2xl font-bold">
            GESTIÓN DE CAJAS
          </h1>
          <div className="flex space-x-4">
            <button
              className="bg-green-400 text-black px-4 py-2 rounded-lg flex items-center hover:bg-green-500"
              onClick={() => navigate("/product")}
            >
              GESTIONAR PRODUCTOS
              <PlusCircle className="ml-2 w-5 h-5" />
            </button>
            <button
              className="bg-blue-400 text-black px-4 py-2 rounded-lg flex items-center hover:bg-blue-500"
              onClick={() => navigate("/list")}
            >
              GESTIONAR LISTAS
              <PlusCircle className="ml-2 w-5 h-5" />
            </button>
            <button
              className="bg-orange-400 text-black px-4 py-2 rounded-lg flex items-center hover:bg-orange-500"
              onClick={() => {
                fetchListas();
                handleOpenModal("agregar");
              }}
            >
              AGREGAR CAJA
              <PlusCircle className="ml-2 w-5 h-5" />
            </button>
            <button
              className="bg-purple-400 text-black px-4 py-2 rounded-lg flex items-center hover:bg-purple-500"
              onClick={() => navigate("/statistics")}
            >
              ESTADÍSTICAS
              <ChartNoAxesCombined className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Modal */}
    <ModalReusable
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalContent === "agregar" ? "GESTIÓN DE PRODUCTOS" : "ELIMINAR CAJA"}
      >
        {modalContent === "agregar" && (
          <div className="space-y-4 p-4">
            <p className="mb-6 text-center">ELIGE UNA LISTA DE PRODUCTOS PARA ABRIR LA CAJA</p>
            {listasDeProductos.length > 0 ? (
              <div>
                <select
                  className="bg-orange-500 text-white w-full py-2 rounded-lg"
                  onChange={(e) => {
                    setListaSeleccionada(e.target.value);  // Aquí se actualiza el estado de listaSeleccionada
                    console.log("Lista seleccionada:", e.target.value);  // Asegúrate de que el valor correcto se esté actualizando
                  }}
                >
                  <option value="">Seleccionar lista</option>
                  {listasDeProductos.map((lista) => (
                    <option key={lista.id_lista} value={lista.id_lista}>
                      {lista.nombre_lista}
                    </option>
                  ))}
                </select>
                <div className="space-y-4 mt-4">
                  <input
                    type="text"
                    placeholder="Nombre de la caja"
                    value={nombreCaja}
                    onChange={(e) => setNombreCaja(e.target.value)}
                    className="border rounded-lg px-4 py-2 text-black w-full"
                  />
                  <input
                    type="date"
                    placeholder="Fecha de creación"
                    value={fechaCaja}
                    onChange={(e) => setFechaCaja(e.target.value)}

                    className="border rounded-lg px-4 py-2 text-black w-full"
                  />
                  <button
                    onClick={handleCrearCaja}
                    className="bg-orange-500 text-white w-full py-2 rounded-lg hover:bg-orange-600"
                  >
                    Crear Caja
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="m-12">No hay listas disponibles, crea una!</p>
                <button
                  className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 mt-4"
                  onClick={() => navigate("/list")}
                >
                  CREAR LISTA
                </button>
              </div>
            )}
            </div>
        )}
       {modalContent === "eliminarCaja" &&(
          <div className="space-y-4 p-4">
            <p className="text-center text-white">¿Estás seguro de que deseas eliminar esta caja?</p>
            <div className="flex justify-center space-x-4">
            <button
                onClick={() => {
                  if (selectedCaja !== null) {
                    handleDeleteCaja(selectedCaja); // Solo llama si selectedCaja no es null
                    handleCloseModal();
                  }
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                Eliminar
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black px-6 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </ModalReusable>

    {/* Contenido Principal */}
    <main className="flex-grow container mx-auto px-4 py-6 flex flex-col items-center">
      {cargando ? (
        <p className="text-lg font-bold text-gray-500">Cargando cajas...</p>
      ) : cajas.length === 0 ? (
        <p className="text-lg font-bold text-gray-500 mt-80">No hay cajas creadas para este usuario.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cajas.map((caja, index) => (
            <div
              key={caja.id || `caja-${index}`}
              className={`bg-gray-200 border-2 p-4 rounded-lg shadow-lg flex flex-col items-center transition-all duration-300 ${caja.estado === "cerrado" ? "border-red-500 bg-red-100 opacity-75" : "border-orange-400"}`}
            >
              <h3 className={`text-lg font-bold mb-2 ${caja.estado === "cerrado" ? "text-red-600" : ""}`}>
                {caja.nombre_caja}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                FECHA DE CREACIÓN: {caja.fecha_apertura}
              </p>
              {caja.estado === "cerrado" && (
                <span className="text-red-500 font-bold mb-2 text-xl">CERRADA</span>
              )}
              <div className="flex space-x-2 mb-4">
                <button
                  className="bg-orange-400 text-black px-3 py-2 rounded-lg hover:bg-orange-500 flex items-center"
                  onClick={() => navigate(`/box-details/${caja.id_caja}`)}
                >
                  <Info className="w-4 h-4 mr-2" />
                  VER DETALLES
                </button>
                {caja.estado !== "cerrado" && (
                  <button
                    className="bg-orange-400 text-black px-3 py-2 rounded-lg hover:bg-orange-500 flex items-center"
                    onClick={() => handleGestionar(caja.id_caja)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    GESTIONAR
                  </button>
                )}
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                onClick={() => {
                  handleOpenModal("eliminarCaja", caja.id_caja); // Pasa el id_caja al modal
                  
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                ELIMINAR
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  </div>
);
}
export default BoxesForm;


