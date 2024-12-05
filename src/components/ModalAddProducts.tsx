import React from "react";

interface ModalAgregarProductosProps {
  productsAvailable: string[];
  onAddProducto: (producto: string) => void;
  onClose: () => void;
}

const ModalAgregarProductos: React.FC<ModalAgregarProductosProps> = ({
  productsAvailable,
  onAddProducto,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">Agregar Productos</h2>
      {productsAvailable.map((products, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center border-b pb-2"
        >
          <span>{products}</span>
          <button
            className="bg-orange-400 text-black px-3 py-1 rounded-lg hover:bg-orange-500"
            onClick={() => {
              onAddProducto(products);
              console.log(`Producto añadido: ${products}`);
            }}
          >
            +
          </button>
        </div>
      ))}
    </div>
  );
};

export default ModalAgregarProductos;
