import React, { useState, useEffect } from "react";
import axios from "axios";

interface ModalAgregarProductosProps {
  onClose: () => void;
}

const ModalAgregarProductos: React.FC<ModalAgregarProductosProps> = ({
  onClose,
}) => {
  const [nombreCaja, setNombreCaja] = useState(""); // Nombre de la caja
  const [productsAvailable, setProductsAvailable] = useState<string[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<
    string[]
  >([]);
  const [selectedProducto, setSelectedProducto] = useState<string>("");

  // Obtener productos disponibles al cargar el componente
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => {
        console.log("Productos disponibles:", response.data); // Verificar los productos recibidos
        if (Array.isArray(response.data)) {
          setProductsAvailable(response.data);
        } else {
          console.error("La respuesta no es un arreglo de productos");
          setProductsAvailable([]); // Asegurarse de que sea un arreglo vacío
        }
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
        setProductsAvailable([]); // Asegurarse de que sea un arreglo vacío en caso de error
      });
  }, []);

  const handleAddProducto = () => {
    if (nombreCaja.trim() === "") {
      alert("Por favor, ingresa un nombre para la caja.");
      return;
    }

    if (!selectedProducto) {
      alert("Por favor, selecciona un producto.");
      return;
    }

    // Agregar el producto seleccionado a la lista de productos seleccionados
    setProductosSeleccionados((prevProductos) => [
      ...prevProductos,
      selectedProducto,
    ]);
    setSelectedProducto(""); // Limpiar la selección actual
  };

  const handleRemoveProducto = (producto: string) => {
    setProductosSeleccionados(
      productosSeleccionados.filter((p) => p !== producto)
    );
  };

  const handleGuardar = () => {
    if (nombreCaja.trim() === "") {
      alert("Por favor, ingresa un nombre para la caja.");
      return;
    }

    // Crear la caja con los productos seleccionados en el backend
    axios
      .post("http://localhost:3000/api/createBoxWithProducts", {
        nombreCaja: nombreCaja,
        productosSeleccionados: productosSeleccionados, // Enviar los IDs de los productos seleccionados
      })
      .then((response) => {
        console.log("Caja creada con productos:", response.data);
        alert("Caja creada correctamente.");
        setProductosSeleccionados([]); // Limpiar la lista de productos seleccionados
        onClose(); // Cerrar el modal
      })
      .catch((error) => {
        console.error("Error al crear la caja:", error);
        alert("Hubo un error al crear la caja.");
      });
  };

  return (
    <div className="p-6 bg-black rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        Agregar Productos a Caja
      </h2>

      {/* Campo para ingresar el nombre de la caja */}
      <input
        type="text"
        placeholder="Nombre de la caja"
        className="w-full border border-gray-300 text-black p-2 rounded-lg mb-4"
        value={nombreCaja}
        onChange={(e) => setNombreCaja(e.target.value)}
      />

      {/* Formulario de selección de productos */}
      <div className="mb-4">
        <select
          className="w-full border text-black border-gray-300 p-2 rounded-lg "
          value={selectedProducto}
          onChange={(e) => setSelectedProducto(e.target.value)}
        >
          <option value="">Selecciona un producto</option>
          {productsAvailable.map((producto, idx) => (
            <option key={idx} value={producto}>
              {producto}
            </option>
          ))}
        </select>
      </div>

      {/* Botón para agregar el producto seleccionado */}
      <button
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-4"
        onClick={handleAddProducto}
      >
        Agregar Producto
      </button>

      {/* Lista de productos seleccionados */}
      <div>
        {productosSeleccionados.length === 0 ? (
          <p className="text-center text-gray-500">
            No has seleccionado ningún producto
          </p>
        ) : (
          productosSeleccionados.map((producto, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b pb-2"
            >
              <span>{producto}</span>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                onClick={() => handleRemoveProducto(producto)}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      {/* Botón para guardar los productos seleccionados */}
      <button
        className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        onClick={handleGuardar}
      >
        Guardar Productos
      </button>

      {/* Botón para cerrar el modal */}
      <button
        className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        onClick={onClose}
      >
        Cerrar
      </button>
    </div>
  );
};

export default ModalAgregarProductos;
