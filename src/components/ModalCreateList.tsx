import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Importar el contexto de autenticación

interface ModalCrearListaProps {
  onSave: (nombre: string) => void;
  onClose: () => void;
}

const ModalCrearLista: React.FC<ModalCrearListaProps> = ({
  onSave,
  onClose,
}) => {
  const { userId, token } = useAuth(); // Acceder al id_usuario y token del contexto
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  console.log("Usuario de createList: ", userId);
  // Manejar el guardado de la lista
  const handleSave = async () => {
    if (!nombre) {
      setError("El nombre de la lista es obligatorio.");
      return;
    }

    setLoading(true);
    setError(""); // Limpiar el error previo

    try {
      const requestBody = { nombre_lista: nombre };
      console.log("Token de autenticación:", token); // Verifica si el token está presente y es válido
      console.log("Datos enviados al backend:", requestBody); // Verifica los datos aquí

      // Realizar la solicitud POST para crear la lista con el nombre
      await axios.post("http://localhost:3000/api/lists", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`, // Usando el token para autenticar la solicitud
        },
      });

      // Si la solicitud es exitosa, ejecutar onSave y cerrar el modal
      onSave(nombre);
      onClose();
    } catch (err) {
      setError("Error al guardar la lista. Intenta nuevamente.");
      console.error("Error al crear la lista:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">
          Crear Nueva Lista
        </h2>

        <input
          type="text"
          placeholder="Nombre de la lista"
          className="w-full border border-gray-300 p-2 rounded-lg text-black mb-4"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button
          className="bg-orange-400 text-white w-full py-2 mt-4 rounded-lg hover:bg-orange-500"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Lista"}
        </button>
        <button
          className="bg-gray-300 text-black w-full py-2 mt-2 rounded-lg hover:bg-gray-400"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ModalCrearLista;
