import React from "react";

interface ModalCargarListaProps {
  listasPredeterminadas: { id: number; nombre: string }[];
  onClose: () => void;
}

const ModalCargarLista: React.FC<ModalCargarListaProps> = ({
  listasPredeterminadas,
  onClose,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">
        Listas Predeterminadas
      </h2>
      <ul className="list-disc space-y-2 px-6">
        {listasPredeterminadas.map((lista) => (
          <li
            key={lista.id}
            className="flex justify-between items-center border-b pb-2"
          >
            {lista.nombre}
            <button
              className="bg-orange-400 text-black px-4 py-1 rounded-lg hover:bg-orange-500"
              onClick={() => {
                console.log(`Seleccionada: ${lista.nombre}`);
                onClose();
              }}
            >
              Seleccionar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModalCargarLista;
