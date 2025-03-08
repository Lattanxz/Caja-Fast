import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Product {
    id_producto: number;
    nombre_producto: string;
    descripcion_producto: string;
    precio_producto: number;
  }
  

const ProductsPage = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | "">("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");   
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Asegúrate de obtener el token

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:3000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
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
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:3000/api/products",
        {
          nombre_producto: nombre,
          descripcion_producto: descripcion,
          precio_producto: precio,
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
      return;
    }
    if (!nombre || !descripcion || !precio) {
      setError("Todos los campos son obligatorios.");
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

  const handleDeleteProduct = async (id_producto: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:3000/api/products/${id_producto}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProductos(); // Recargar lista después de eliminar
      toast.success("Producto eliminado correctamente");
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError("No se pudo eliminar el producto. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container mx-auto p-8">
        <button onClick={() => navigate("/boxes")} className="bg-blue-500 text-white p-2 rounded mb-4">
            Volver
        </button>
        <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>
        {error && <p className="text-red-500">{error}</p>}
        {/* El resto del formulario y la tabla aquí */}

      <div className="mb-6 flex gap-4">
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
        <button onClick={selectedProduct ? handleEditProduct : handleAddProduct} className="bg-green-500 text-white p-2 rounded">
          {selectedProduct ? "Guardar" : <Plus />}
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
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
              <td colSpan={4} className="text-center p-4">No hay productos disponibles.</td>
            </tr>
          ) : (
            productos.map((product) => (
              <tr key={product.id_producto} className="border">
                <td className="border p-2">{product.nombre_producto}</td>
                <td className="border p-2">{product.descripcion_producto}</td>
                <td className="border p-2">${product.precio_producto}</td>
                <td className="border p-2 flex gap-2">
                  <button onClick={() => { setSelectedProduct(product); 
                    setNombre(product.nombre_producto); 
                    setDescripcion(product.descripcion_producto); 
                    setPrecio(product.precio_producto); }} className="bg-yellow-500 text-white p-1 rounded">
                    <Pencil />
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id_producto)} className="bg-red-500 text-white p-1 rounded">
                    <Trash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
