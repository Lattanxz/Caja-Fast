import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { toast } from 'sonner';

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
        setLists(response.data);
      } catch (error) {
        console.error("Error al obtener las listas:", error);
      }
    };
  
    const fetchProducts = async () => {
      try {
        if (!token) return; // Evitar hacer la solicitud sin autenticación
  
        const response = await axios.get<Product[]>("http://localhost:3000/api/products", {
          headers: {
            "X-User-ID": userId, // Agregar id_usuario como encabezado  
          },
          params: {
            id_usuario: userId, // Enviar el userId en los parámetros
          },
        });
  
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
  
    useEffect(() => {
      fetchLists();
      fetchProducts();
    }, [userId, token]); // Ejecutar cuando userId o token cambien


    
    const handleSave = async () => {
      if (!nombre) {
        toast.error('El nombre de la lista no puede estar vacío.');  // Notificación de error con Sonner
        return;
      }
    
      if (!allProducts || allProducts.length === 0) {
        setError("Debe crear productos antes de poder crear una lista.");
        return;
      }
    
      if (productos.some((producto) => !producto.id_producto || isNaN(parseInt(producto.id_producto, 10)))) {
        toast.error("Todos los productos deben tener un ID válido.");
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
      const response = await axios.delete(`http://localhost:3000/api/lists/${id_lista}`);
      
      // Si la respuesta es exitosa, actualizamos la lista
      if (response.status === 200) {
        setLists(lists.filter((list) => list.id_lista !== id_lista));
        console.log(`Lista con ID ${id_lista} eliminada correctamente.`);
        toast.success('Lista eliminada correctamente');  // Notificación de éxito con Sonner
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        // Si el error es debido a cajas abiertas, mostramos el mensaje de error
        toast.error(error.response.data.message || 'No se puede eliminar la lista porque tiene cajas abiertas.');  // Notificación de error con Sonner
      } else {
        // Manejar otros errores genéricos
        console.error("Error al eliminar la lista:", error);
        toast.error('Hubo un error al intentar eliminar la lista.');  // Notificación de error con Sonner
      }
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
          <div className="w-full">
            <Navbar isLoggedIn={isLoggedIn} userRole={userRole ?? undefined} />
          </div>
          <header className="bg-black py-4 w-full">
            <div className="container px-12 mx-auto text-sm text-black">
              <div className="flex justify-between items-center">
                <h1 className="text-center text-white text-2xl font-bold">
                  LISTA DE PRODUCTOS
                </h1>
              </div>
            </div>
          </header>
          <div className="flex flex-col items-center w-full pt-6">
          <div className="w-[1000px] max-w-full border-2 rounded p-4">
            {/* Contenedor flex para título centrado y botones alineados */}
            <div className="flex justify-between items-center w-full mb-4">
              {/* Botón Volver alineado a la izquierda */}
              <div className="flex justify-start">
                <button
                  className="bg-orange-500 text-white p-2 rounded"
                  onClick={() => navigate("/boxes")}
                >
                  Volver
                </button>
              </div>

              {/* Título centrado */}
              <h2 className="text-black text-2xl font-bold flex-grow text-center">
                Listas existentes
              </h2>

              {/* Botón Agregar Lista alineado a la derecha */}
              <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={() => {
                  if (allProducts.length === 0) {
                    setShowForm((prev) => !prev); // Alternar el modal de "No hay productos"
                  } else {
                    setShowForm((prev) => !prev); // Alternar el formulario de creación de listas
                  }
                }}
              >
                Agregar Lista
              </button>
              </div>
            </div>

            {showForm && (
                <div className="border p-4 rounded shadow-md mb-4 border-black">
                  {allProducts.length === 0 ? (
                    // ⚠️ Si no hay productos, muestra este mensaje en lugar del formulario
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-2">No puedes crear una lista porque no tienes productos creados aún.</p>
                      <button 
                        className="bg-green-500 text-white p-2 rounded"
                        onClick={() => window.location.href = "/product"} // Ajusta la URL a la de tu página de productos
                      >
                        Crear Productos
                      </button>
                    </div>
                  ) : (
                    // ✅ Si hay productos, muestra el formulario normal
                    <>
                      <h2 className="text-lg font-semibold mb-2">Crear Nueva Lista</h2>
                      <input
                        type="text"
                        placeholder="Nombre de la lista"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="border p-2 w-full rounded mb-2 border-black"
                      />
                      <select
                        className="border p-2 w-full rounded mb-2 border-black"
                        onChange={(e) => handleProductSelection(parseInt(e.target.value))}
                      >
                        <option value="">Selecciona un producto</option>
                        {allProducts
                          .filter((p) => !productos.some((pr) => pr.id_producto === p.id_producto))
                          .map((producto) => (
                            <option key={producto.id_producto} value={producto.id_producto}>
                              {producto.nombre_producto}
                            </option>
                          ))}
                      </select>
                      <ul className="list-disc pl-5">
                        {productos.map((producto) => (
                          <li key={producto.id_producto} className="flex justify-between items-center border p-2 rounded">
                            {producto.nombre_producto}
                            <button className="text-red-500" onClick={() => handleRemoveProduct(producto.id_producto)}>
                              X
                            </button>
                          </li>
                        ))}
                      </ul>
                      {error && <p className="text-red-500">{error}</p>}
                      <div className="flex gap-2 mt-2">
                        <button className="bg-orange-500 text-white p-2 rounded" onClick={handleSave} disabled={loading}>
                          {loading ? "Guardando..." : "Guardar Lista"}
                        </button>
                        <button className="bg-red-500 text-white p-2 rounded" onClick={() => setShowForm(false)}>
                          Cancelar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
                <div className="space-y-4 h-[650px] overflow-y-auto p-4 border rounded">
                  {lists.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg font-semibold mt-60">No hay listas para este usuario aún.</p>
                  ) : (
                    lists.map((lista) => (
                      <div key={lista.id_lista} className="border p-4 rounded shadow-md border-black">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-semibold">{lista.nombre_lista}</h2>
                          <div className="flex gap-2">
                            <button
                              className="bg-red-500 text-white p-1 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(lista.id_lista);
                              }}
                            >
                              Eliminar
                            </button>
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
                            {allProducts
                              .filter((p) => !lista.productos.some((pr) => pr.id_producto === p.id_producto))
                              .map((producto) => (
                                <option key={producto.id_producto} value={producto.id_producto}>
                                  {producto.nombre_producto}
                                </option>
                              ))}
                          </select>
                        )}
                        <ul className="list-disc pl-5">
                          {lista.productos.map((producto) => (
                            <li key={producto.id_producto} className="flex justify-between items-center border p-2 rounded border-gray-300 mb-2">
                              {producto.nombre_producto}
                              <button
                                className="text-red-500"
                                onClick={() => handleRemoveProductFromList(lista.id_lista, producto.id_producto)}
                              >
                                X
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
        </div>
      </div>
    </div>
  );
};


export default ListasPage;
