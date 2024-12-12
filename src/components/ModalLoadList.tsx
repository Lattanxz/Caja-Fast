import { useState, useEffect } from "react";
import axios from "axios";

interface Producto {
  id_producto: number;
  nombre_producto: string;
}

interface List {
  id_lista: number;
  nombre_lista: string;
  productos: Producto[]; // Asegúrate de que coincide con los datos del backend
}

const ListModal = () => {
  const [lists, setLists] = useState<List[]>([]); // Lista de listas
  const [selectedList, setSelectedList] = useState<List | null>(null); // Lista seleccionada
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal

  // Fetch de las listas al cargar el componente
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/lists");
        console.log("Datos obtenidos:", response.data); // Depuración
        setLists(response.data); // Establece las listas en el estado
      } catch (error) {
        console.error("Error al obtener las listas:", error);
      }
    };

    fetchLists();
  }, []);

  // Abre el modal y selecciona una lista
  const handleOpenModal = (list: List) => {
    setSelectedList(list);
    setIsModalOpen(true);
  };

  // Cierra el modal y limpia la lista seleccionada
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedList(null);
  };

  return (
    <div>
      <h2 className="text-center">Selecciona una lista</h2>
      <ul className="py-4">
        {lists.map((list) => (
          <li
            key={list.id_lista}
            onClick={() => handleOpenModal(list)}
            style={{ cursor: "pointer" }}
          >
            {list.nombre_lista}
          </li>
        ))}
      </ul>

      {isModalOpen && selectedList && (
        <div className="modal">
          <div className="modal-content py-4">
            <h3 className="py-2">{selectedList.nombre_lista}</h3>
            <p>ID Lista: {selectedList.id_lista}</p>
            <h4>Productos:</h4>
            <ul className="py-4">
              {selectedList.productos.length > 0 ? (
                selectedList.productos.map((producto) => (
                  <li key={producto.id_producto}>{producto.nombre_producto}</li>
                ))
              ) : (
                <li>No hay productos disponibles</li>
              )}
            </ul>
            <button onClick={handleCloseModal} className="close-modal-button">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListModal;
