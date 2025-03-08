import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

interface Product {
  id_producto: number;
  nombre_producto: string;
}

interface List {
  id_lista: number;
  nombre_lista: string;
  productos: Product[];
}

interface ListasPageProps {
    initialListas: any[];
    onSave: (nombre: string, productos: any[]) => void;
    onClose: () => void;
};

const ListasPage: React.FC<ListasPageProps> = ({ initialListas, onSave, onClose }) => {
    const [lists, setLists] = useState<List[]>([]);
    const { userId, isLoggedIn, userRole, token } = useAuth();
    const [nombre, setNombre] = useState("");
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [showProductSelectForList, setShowProductSelectForList] = useState<number | null>(null);
    const navigate = useNavigate();

  const fetchLists = async () => {
    try {
      const response = await axios.get<List[]>("http://localhost:3000/api/lists");
      console.log("Datos obtenidos:", response.data);
      console.log("User ID: ", userId);
      setLists(response.data);
    } catch (error) {
      console.error("Error al obtener las listas:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>("http://localhost:3000/api/products");
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  useEffect(() => {
    fetchLists();
    fetchProducts();
  }, []);

  const handleSave = async () => {
    if (!nombre) {
      setError("El nombre de la lista es obligatorio.");
      return;
    }

    if (productos.some((producto) => !producto.id_producto || isNaN(parseInt(producto.id_producto, 10)))) {
      setError("Todos los productos deben tener un ID válido.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const requestBody = {
        nombre_lista: nombre,
        id_usuario: userId,
        productos: productos.map((p) => ({
          id_producto: parseInt(p.id_producto, 10),
        })),
      };

      const response = await axios.post("http://localhost:3000/api/lists", requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { id_lista } = response.data;

      const productData = {
        id_lista: id_lista,
        id_usuario: userId,
        productos: productos.map((producto) => ({
          id_producto: parseInt(producto.id_producto, 10),
          cantidad: producto.cantidad || 1,
        })),
      };

      await axios.post("http://localhost:3000/api/listProducts", productData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNombre("");
      setProductos([]);
      setShowForm(false);
      onSave(nombre, productos);
      onClose();
      fetchLists();
    } catch (err: any) {
      setError("Error al guardar la lista. Intenta nuevamente.");
      console.error("Error al crear la lista:", err);
      if (err.response) {
        setError(err.response.data.message || "Hubo un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id_lista: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/lists/${id_lista}`);
      setLists(lists.filter((list) => list.id_lista !== id_lista));
      console.log(`Lista con ID ${id_lista} eliminada correctamente.`);
    } catch (error) {
      console.error("Error al eliminar la lista:", error);
    }
  };

  const handleProductSelection = (id: number) => {
    const product = allProducts.find(p => p.id_producto === id);
    if (product && !productos.some(p => p.id_producto === id)) {
      setProductos([...productos, product]);
    }
  };

  const handleProductSelectionForList = async (id_lista: number, id_producto: number) => {
    const product = allProducts.find(p => p.id_producto === id_producto);
    if (product) {
      try {
        await axios.post("http://localhost:3000/api/listProducts", {
          id_lista,
          productos: [{ id_producto: id_producto}]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const updatedLists = lists.map(list => {
          if (list.id_lista === id_lista && !list.productos.some(p => p.id_producto === id_producto)) {
            return { ...list, productos: [...list.productos, product] };
          }
          return list;
        });
        setLists(updatedLists);
      } catch (error) {
        console.error("Error al agregar el producto a la lista:", error);
      }
      setShowProductSelectForList(null);
    }
  };

  const handleRemoveProduct = (id: number) => {
    setProductos(productos.filter(p => p.id_producto !== id));
  };

  const handleRemoveProductFromList = async (id_lista: number, id_producto: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/listProducts/${id_lista}/${id_producto}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const updatedLists = lists.map(list => {
        if (list.id_lista === id_lista) {
          return { ...list, productos: list.productos.filter(p => p.id_producto !== id_producto) };
        }
        return list;
      });
      setLists(updatedLists);
      console.log(`Producto ${id_producto} eliminado de la lista ${id_lista} correctamente.`);
    } catch (error) {
      console.error("Error al eliminar el producto de la lista:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
       <Navbar isLoggedIn={isLoggedIn} userRole={userRole ?? undefined} />
       <header className="bg-black py-4">
        <div className="container px-12 mx-auto text-sm text-black">
            <div className="flex justify-between items-center">
              <h1 className="text-center text-white text-2xl font-bold text-black">
                Lista de productos
              </h1>
            </div>
          </div>
        </header>

        <h2 className="text-black text-2xl font-bold text-black pt-4 pb-4 pl-4">
                Listas existentes
        </h2>
    <button
      className="bg-orange-500 text-white p-2 rounded mb-4 mr-4"
      onClick={() => navigate("/boxes")}
    >
      Volver
    </button>

    <button
      className="bg-black text-white p-2 rounded mb-4"
      onClick={() => setShowForm(true)}
    >
      Agregar Lista
    </button>

      {showForm && (
        <div className="border p-4 rounded shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-2">Crear Nueva Lista</h2>
          <input
            type="text"
            placeholder="Nombre de la lista"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          />
          <select
            className="border p-2 w-full rounded mb-2"
            onChange={(e) => handleProductSelection(parseInt(e.target.value))}
          >
            <option value="">Selecciona un producto</option>
            {allProducts.filter(p => !productos.some(pr => pr.id_producto === p.id_producto)).map(producto => (
              <option key={producto.id_producto} value={producto.id_producto}>
                {producto.nombre_producto}
              </option>
            ))}
          </select>
          <ul className="list-disc pl-5">
            {productos.map(producto => (
              <li key={producto.id_producto} className="flex justify-between items-center border p-2 rounded ">
                {producto.nombre_producto}
                <button className="text-red-500" onClick={() => handleRemoveProduct(producto.id_producto)}>X</button>
              </li>
            ))}
          </ul>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex gap-2 mt-2">
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Lista"}
            </button>
            <button
              className="bg-gray-500 text-white p-2 rounded"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 border-2 rounded p-4 border-orange-500"> 
        {lists.map((lista) => (
          <div key={lista.id_lista} className="border p-4 rounded shadow-md border-black" >
            <div className="flex justify-between items-center mb-2 ">
              <h2 className="text-lg font-semibold">{lista.nombre_lista}</h2>
              <div className="flex gap-2">
                <button className="bg-red-500 text-white p-1 rounded" onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(lista.id_lista);
                }}>Eliminar</button>
               <button
                  className="bg-orange-500 text-white p-1 rounded"
                  onClick={() => setShowProductSelectForList(lista.id_lista)}
                >
                  Agregar Producto
                </button>
              </div>
            </div>
            {showProductSelectForList === lista.id_lista && (
              <select
                className="border p-2 w-full rounded mb-2"
                onChange={(e) => handleProductSelectionForList(lista.id_lista, parseInt(e.target.value))}
              >
                <option value="">Selecciona un producto</option>
                {allProducts.filter(p => !lista.productos.some(pr => pr.id_producto === p.id_producto)).map(producto => (
                  <option key={producto.id_producto} value={producto.id_producto}>
                    {producto.nombre_producto}
                  </option>
                ))}
              </select>
            )}
            <ul className="list-disc pl-5">
              {lista.productos.map((producto) => (
                <li
                  key={producto.id_producto}
                  className="flex justify-between items-center border border-black p-2 rounded border-black mb-2"
                >
                  {producto.nombre_producto} 
                  <button className="text-red-500" onClick={() => handleRemoveProductFromList(lista.id_lista, producto.id_producto)}>X</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ListasPage;
