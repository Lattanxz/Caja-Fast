import React, { useState } from "react";

interface ModalCrearListaProps {
  onSave: (nombre: string, productos: string[]) => void;
  onClose: () => void;
}

const ModalCrearLista: React.FC<ModalCrearListaProps> = ({
  onSave,
  onClose,
}) => {
  const [nombre, setNombre] = useState("");
  const [productos, setProductos] = useState<string[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState("");

  const handleAddProducto = () => {
    if (nuevoProducto.trim() !== "") {
      setProductos([...productos, nuevoProducto.trim()]);
      setNuevoProducto("");
    }
  };

  const handleSave = () => {
    onSave(nombre, productos);
    onClose();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">Crear Nueva Lista</h2>
      <input
        type="text"
        placeholder="Nombre de la lista"
        className="w-full border border-gray-300 p-2 rounded-lg text-black mb-4"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Agregar producto"
          className="w-full border border-gray-300 p-2 rounded-lg text-black"
          value={nuevoProducto}
          onChange={(e) => setNuevoProducto(e.target.value)}
        />
        <button
          className="bg-orange-400 text-black w-full py-2 rounded-lg hover:bg-orange-500"
          onClick={handleAddProducto}
        >
          Agregar Producto
        </button>
      </div>
      <div>
        <h4 className="font-bold mb-2">Productos en la lista:</h4>
        <ul className="list-disc pl-4">
          {productos.map((producto, idx) => (
            <li key={idx}>{producto}</li>
          ))}
        </ul>
      </div>
      <button
        className="bg-orange-400 text-black w-full py-2 mt-4 rounded-lg hover:bg-orange-500"
        onClick={handleSave}
      >
        Guardar Lista
      </button>
    </div>
  );
};

export default ModalCrearLista;
