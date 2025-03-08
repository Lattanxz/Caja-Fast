import { useState } from "react";
import { X } from "lucide-react";

interface ModalEditSaleProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any;
  productos: any[];
  metodosPago: any[];
  onSave: (updatedSale: any) => void;
}

const ModalEditSale = ({ isOpen, onClose, sale, productos, metodosPago, onSave }: ModalEditSaleProps) => {
  const [selectedProduct, setSelectedProduct] = useState(sale.id_producto || "");
  const [cantidad, setCantidad] = useState(sale.cantidad);
  const [selectedMetodoPago, setSelectedMetodoPago] = useState(sale.id_metodo_pago || "");

  const handleSave = () => {
    if (!selectedProduct || !selectedMetodoPago) {
      alert("Por favor, seleccione un producto y un método de pago.");
      return;
    }

    const updatedSale = {
      ...sale,
      id_producto: selectedProduct,
      cantidad,
      id_metodo_pago: selectedMetodoPago,
    };
    onSave(updatedSale);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96 border-4 border-orange-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="mb-4 text-center text-xl font-bold text-white">EDITAR VENTA</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-red-500" />
          </button>
        </div>

        <select
          className="p-2 border rounded w-full mb-4 bg-orange-500 text-black"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(parseInt(e.target.value))}
        >
          <option value="">Seleccione un producto</option>
          {productos.map((producto) => (
            <option key={producto.id_producto} value={producto.id_producto}>
              {producto.nombre_producto}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="p-2 border rounded w-full mb-4"
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value))}
        />

        <select
          className="p-2 border rounded w-full mb-4 bg-orange-500 text-black"
          value={selectedMetodoPago}
          onChange={(e) => setSelectedMetodoPago(parseInt(e.target.value))}
        >
          <option value="">Seleccione un método de pago</option>
          {metodosPago.map((metodo) => (
            <option key={metodo.id_metodo_pago} value={metodo.id_metodo_pago}>
              {metodo.tipo_metodo_pago}
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-2">
          <button className="bg-red-500 text-white p-2 rounded" onClick={onClose}>Cancelar</button>
          <button className="bg-green-500 text-white p-2 rounded" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditSale;
