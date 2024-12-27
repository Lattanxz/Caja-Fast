import React, { useState } from "react";
import axios from "axios";

interface ModalCreateCajaProps {
  onClose: () => void;
  onCajaCreated: (idCaja: number) => void; // Callback al crear la caja
}

const ModalCreateCaja: React.FC<ModalCreateCajaProps> = ({
  onClose,
  onCajaCreated,
}) => {
  const [nombreCaja, setNombreCaja] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCrearCaja = async () => {
    if (!nombreCaja.trim()) {
      setError("El nombre de la caja es obligatorio.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Enviar datos al backend
      const response = await axios.post("/api/cajas", {
        nombre_caja: nombreCaja,
      });
      const nuevaCaja = response.data;

      // Notificar al padre que la caja se creó
      onCajaCreated(nuevaCaja.id_caja);
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error al crear la caja:", error);
      setError("Hubo un problema al crear la caja.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h4 className="text-center font-semibold mb-2">Crear Nueva Caja</h4>
      <input
        type="text"
        value={nombreCaja}
        onChange={(e) => setNombreCaja(e.target.value)}
        placeholder="Nombre de la caja"
        className="w-full px-4 py-2 border rounded text-black"
      />
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleCrearCaja}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Caja"}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ModalCreateCaja;
