import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";


interface Product {
    id_producto: number;
    nombre_producto: string;
    descripcion_producto: string;
    precio_producto: number;
    id_usuario: number;
  }
  

const ProductsPage = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const { isLoggedIn, userRole, userId } = useAuth();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | "">("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");   
  const [showForm, setShowForm] = useState(false); // Estado para mostrar el formulario
  const [showModal, setShowModal] = useState(false); // Estado para el modal de confirmación
  const [productToDelete, setProductToDelete] = useState<number | null>(null); // Producto seleccionado para eliminar

  
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Asegúrate de obtener el token

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    setError("");
    const id_usuario = userId; // Obtener el id_usuario desde el AuthContext
  
    try {
      const response = await axios.get("http://localhost:3000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-User-ID": id_usuario, // Enviar id_usuario como un encabezado
        },
      });
      console.log(response.data);
      setProductos(response.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddProduct = async () => {
    if (!nombre || !descripcion || precio === "" || precio <= 0) {
      setError("Todos los campos son obligatorios y el precio debe ser mayor a 0.");
      toast.error("Todos los campos son obligatorios y el precio debe ser mayor a 0.");
      return;
    }
  
    if (descripcion.length < 10) {
      setError("La descripción del producto debe tener al menos 10 caracteres.");
      toast.error("La descripción debe tener al menos 10 caracteres.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    const id_usuario = userId; // Obtener el id_usuario desde el AuthContext.
  
    try {
      await axios.post(
        "http://localhost:3000/api/products",
        {
          nombre_producto: nombre,
          descripcion_producto: descripcion,
          precio_producto: precio,
          id_usuario: id_usuario, // Agregar el id_usuario
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setNombre("");
      setDescripcion("");
      setPrecio("");
      fetchProductos(); // Recargar lista de productos
      toast.success("Producto agregado correctamente");
    } catch (err) {
      setError("Error al guardar el producto. Intenta nuevamente.");
      console.error("Error al crear el producto:", err);
    } finally {
      setLoading(false);
    }
  };  
  

  const handleEditProduct = async () => {
    if (!selectedProduct) {
      setError("Debes seleccionar un producto para editar.");
      toast.error("Debes seleccionar un producto para editar.");
      return;
    }
    if (!nombre || !descripcion || !precio) {
      setError("Todos los campos son obligatorios.");
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.put(
        `http://localhost:3000/api/products/${selectedProduct.id_producto}`,
        {
          nombre_producto: nombre,
          descripcion_producto: descripcion,
          precio_producto: precio,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedProduct(null);
      setNombre("");
      setDescripcion("");
      setPrecio("");
      fetchProductos(); // Recargar lista
      toast.success("Producto editado correctamente");
    } catch (err) {
      setError("Error al actualizar el producto. Intenta nuevamente.");
      console.error("Error al actualizar el producto:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
  
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.delete(`http://localhost:3000/api/products/${productToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        toast.success(response.data.mensaje || "Producto eliminado correctamente");
        fetchProductos();
      }
    } catch (err: any) {
      console.error("Error al eliminar producto:", err);
  
      if (err.response) {
        const errorMessage = err.response.data.mensaje || "No se pudo eliminar el producto.";
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        toast.error("Hubo un error en la conexión con el servidor.");
        setError("Error de conexión. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
      setShowModal(false); // Cerrar el modal después de la eliminación
    }
  };
  
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole ?? undefined} />

      {/* Encabezado de la página */}
      <header className="bg-black py-4 w-full">
        <div className="container px-12 mx-auto text-sm text-black">
          <h1 className="text-white text-2xl font-bold">PRODUCTOS EXISTENTES</h1>
        </div>
      </header>

      {/* Contenedor principal centrado */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 border mt-4">
        <div className="flex justify-between items-center w-full mb-4">
          <button onClick={() => navigate("/boxes")} className="bg-orange-500 text-white py-2 px-4 rounded">
            Volver
          </button>
          <h2 className="text-xl font-bold flex-grow text-center">Gestión de Productos</h2>

          {/* Botón Agregar Producto al lado derecho */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-500 text-white p-2 rounded"
          >
            <Plus />
          </button>
        </div>

        {/* Mostrar formulario solo cuando showForm es true */}
        {showForm && (
          <div className="mb-6 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value === "" ? "" : parseFloat(e.target.value))}
              className="border p-2 rounded w-full"
            />
            <button onClick={selectedProduct ? handleEditProduct : handleAddProduct} className="bg-green-500 text-white py-2 rounded">
              {selectedProduct ? "Guardar" : "Agregar Producto"}
            </button>
          </div>
        )}

        {/* Tabla de productos */}
        <div className="overflow-y-auto max-h-[400px]">
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Descripción</th>
                <th className="border p-2">Precio</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center p-4">Cargando productos...</td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4">No hay productos disponibles aún.</td>
                </tr>
              ) : (
                productos.map((product) => (
                  <tr key={product.id_producto} className="border">
                    <td className="border p-2">{product.nombre_producto}</td>
                    <td className="border p-2">{product.descripcion_producto}</td>
                    <td className="border p-2">${product.precio_producto}</td>
                    <td className="border p-2 flex gap-2">
                      <button onClick={() => { 
                        setSelectedProduct(product); 
                        setNombre(product.nombre_producto); 
                        setDescripcion(product.descripcion_producto); 
                        setPrecio(product.precio_producto); 
                        setShowForm(true); // Mostrar el formulario para editar
                      }} className="bg-yellow-500 text-white p-2 rounded">
                        <Pencil />
                      </button>
                      <button onClick={() => {
                        setProductToDelete(product.id_producto);
                        setShowModal(true);
                      }} className="bg-red-500 text-white p-2 rounded">
                        <Trash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold">¿Estás seguro de que quieres eliminar este producto?</h3>
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="bg-gray-300 text-black py-2 px-4 rounded">
                Cancelar
              </button>
              <button onClick={handleDeleteProduct} className="bg-red-500 text-white py-2 px-4 rounded">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
