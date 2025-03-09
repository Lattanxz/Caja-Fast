import { useEffect, useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender, CellContext } from "@tanstack/react-table";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from 'sonner';
import { Pencil, X } from "lucide-react"
import ModalEditSale from "./ModalEditSale";
import ChartsDashboard from "./ChartsDashboard";
import {SalesData} from "./ChartsDashboard";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

interface Sale {
  id_venta: number;
  nombre_producto: string;
  cantidad: number;
  nombre_caja: string;
  precio_producto: number;
  fecha_venta: string;
  id_producto: number; 
  id_metodo_pago: number;
  total: number;
}

interface MetodoPago {
  id_metodo_pago: number;
  tipo_metodo_pago: string;
}

interface SalesFormProps {
  id_caja: number;
  id_lista?: number;
}

const SalesForm = () => {
  const { id_caja, id_lista } = useParams<{ id_caja: string; id_lista?: string }>();
  const location = useLocation();
  const listaId = id_lista ? parseInt(id_lista) : location.state?.id_lista;

  if (!id_caja) {
    return <div>Error: Caja no encontrada</div>;
  }

  return <SalesFormContent id_caja={parseInt(id_caja)} id_lista={listaId} />;
};

const SalesFormContent = ({ id_caja, id_lista }: SalesFormProps) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | "">("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [selectedMetodoPago, setSelectedMetodoPago] = useState<number | "">("");
  const [precioProducto, setPrecioProducto] = useState<number>(0);
  const [nombreCaja, setNombreCaja] = useState<string>(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
   const { isLoggedIn, userRole } = useAuth();

  const navigate = useNavigate();

  // Función para calcular los porcentajes de métodos de pago
  const calculatePaymentPercentages = (sales: Sale[], metodosPago: MetodoPago[]) => {
    const totalProductos = sales.reduce((acc, sale) => acc + (sale.cantidad || 0), 0);
  
    const metodoPago = Object.entries(
      sales.reduce((acc, sale) => {
        const metodo = metodosPago.find(m => m.id_metodo_pago === sale.id_metodo_pago)?.tipo_metodo_pago;
        if (metodo) {
          acc[metodo] = (acc[metodo] || 0) + (sale.cantidad || 0);
        }
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({
      name,
      value: totalProductos > 0 ? parseFloat(((value / totalProductos) * 100).toFixed(2)) : 0, // Limitar a 2 decimales
    }));
  
    console.log("MetodoPago Data:", metodoPago);
    return metodoPago;
  };
  
  
  

  const transformSalesData = (sales: Sale[]): SalesData[] => {
    return sales.map((sale) => ({
      nombre_producto: sale.nombre_producto,
      cantidad: sale.cantidad,
      tipo_metodo_pago: metodosPago.find(m => m.id_metodo_pago === sale.id_metodo_pago)?.tipo_metodo_pago || "",
      total: sale.total
    }));
  };

  const salesData = useMemo(() => transformSalesData(sales), [sales, metodosPago]);
  const paymentPercentages = useMemo(() => calculatePaymentPercentages(sales, metodosPago), [sales, metodosPago]);


  // Función para calcular el total de la venta sumando solo lo que está en la tabla
  const calcularTotal = () => {
    const total = sales.reduce((acc, sale) => {
      console.log(`Producto: ${sale.nombre_producto}, Cantidad: ${sale.cantidad}, Precio Producto: ${sale.precio_producto}`);
      return acc + sale.precio_producto;
    }, 0);

    console.log("Total calculado:", total);
    return total;
  };


const fetchSales = async (id_caja: number) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/sales/${id_caja}`);
    if (Array.isArray(res.data)) {
      setSales(res.data.filter((sale) => sale.nombre_producto));
    } else {
      console.error("La respuesta no es un array:", res.data);
      toast.error("La respuesta no es válida");
    }
  } catch (err) {
    console.error("Error al obtener ventas", err);
    toast.error("Error al obtener ventas");
  }
};

const fetchProducts = async (id_lista: number) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/products/list/${id_lista}`);
    setProductos(res.data);
  } catch (err) {
    console.error("Error al obtener productos", err);
    toast.error("Error al obtener productos");
  }
};

const fetchPaymentMethods = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/paymentMethod");
    setMetodosPago(res.data);
  } catch (err) {
    console.error("Error al obtener métodos de pago", err);
    toast.error("Error al obtener métodos de pago");
  }
};

const fetchBoxName = async (id_caja: number) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/boxes/${id_caja}`);
    setNombreCaja(res.data.nombre_caja);
  } catch (err) {
    console.error("Error al obtener el nombre de la caja", err);
    toast.error("Error al obtener el nombre de la caja");
  }
};

useEffect(() => {
  fetchSales(id_caja);
}, [id_caja]);

useEffect(() => {
  if (id_lista) fetchProducts(id_lista);
}, [id_lista]);

useEffect(() => {
  fetchPaymentMethods();
}, []);

useEffect(() => {
  fetchBoxName(id_caja);
}, [id_caja]);

const handleModalOpen = (sale: Sale) => {
  setSelectedSale(sale);
  setIsModalOpen(true);
};

const handleEdit = (sale: Sale) => {
  handleModalOpen(sale);
};

const handleDelete = async (id_venta: number) => {
  try {
    await axios.delete(`http://localhost:3000/api/sales/delete/${id_venta}`);
    toast.success("Venta eliminada correctamente");
    fetchSales(id_caja);
  } catch (err) {
    console.error("Error al eliminar la venta", err);
    toast.error("Error al eliminar la venta");
  }
};

const handleSaveSale = async (updatedSale: Sale) => {
  console.log("ID Venta:", updatedSale.id_venta);
  console.log("Cantidad:", updatedSale.cantidad);
  try {
    await axios.put(`http://localhost:3000/api/sales/update/${updatedSale.id_venta || "sin_id"}`, updatedSale);
    toast.success("Venta actualizada correctamente");
    setIsModalOpen(false);
    await fetchSales(id_caja);
  } catch (err) {
    console.error("Error al actualizar la venta", err);
    toast.error("Error al actualizar la venta");
  }
};

async function handleCloseBox() {
  try {
    await axios.put(`http://localhost:3000/api/boxes/${id_caja}`, { estado: "cerrado" });
    toast.success("Caja cerrada correctamente");
    navigate("/boxes");
  } catch (error) {
    console.error("Error al cerrar la caja", error);
    alert("Hubo un error al cerrar la caja");
  }
}


const handleAddSale = async () => {
  if (!selectedProduct || !selectedMetodoPago || cantidad <= 0) {
    toast.error("Por favor, selecciona un producto, método de pago y cantidad.");
    return;
  }

  const productoSeleccionado = productos.find((producto) => producto.id_producto === parseInt(selectedProduct));
  if (!productoSeleccionado) {
    toast.error("Producto no encontrado.");
    return;
  }

  const metodoPagoSeleccionado = metodosPago.find((metodo) => metodo.id_metodo_pago === selectedMetodoPago);
  if (!metodoPagoSeleccionado) {
    toast.error("Método de pago no encontrado.");
    return;
  }

  const newSale = {
    id_caja,
    id_producto: parseInt(selectedProduct),
    cantidad,
    id_metodo_pago: selectedMetodoPago,
    nombre_caja: nombreCaja,
    tipo_metodo_pago: metodoPagoSeleccionado.tipo_metodo_pago,
    precio_producto: productoSeleccionado.precio_producto,
    nombre_producto: productoSeleccionado.nombre_producto,
  };

  try {
    await axios.post("http://localhost:3000/api/sales/addProduct", newSale);
    toast.success("Venta registrada correctamente");
    await fetchSales(id_caja); // Refrescar las ventas después de agregar
  } catch (error) {
    console.error("Error al registrar la venta", error);
    toast.error("Error al registrar la venta.");
  }
};



  const columns = [
    {
      header: "Nombre Producto",
      accessorKey: "nombre_producto",
    },
    {
      header: "Cantidad",
      accessorKey: "cantidad",
    },
    {
      header: "Método Pago",
      accessorKey: "id_metodo_pago", // Cambiamos esto
      cell: (info: CellContext<any, any>) => {
        const metodo = metodosPago.find(m => m.id_metodo_pago === info.getValue());
        return metodo ? metodo.tipo_metodo_pago : "Método no encontrado";
      }
    },
    {
      header: "Precio Producto",
      cell: (info: CellContext<any, any>) => {
        const precioTotal = info.getValue(); // El precio ya viene como total desde la base de datos
        return `$${precioTotal.toFixed(2)}`; // Mostramos directamente el total
      },
      accessorKey: "precio_producto",
    }
  ];
  const table = useReactTable({
    data: sales,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="w-full">
          <Navbar isLoggedIn={isLoggedIn} userRole={userRole ?? undefined} />
        </div>

        <header className="bg-black py-4 w-full">
          <div className="container px-12 mx-auto text-sm text-black">
            <div className="flex justify-between items-center">
              <h1 className="text-center text-white text-2xl font-bold">
                VENTAS
              </h1>
            </div>
          </div>
        </header>

        <div className="flex flex-col justify-center items-center min-h-screen space-y-8">
          {/* Contenedor de ventas */}
          <div className="p-4 border rounded-xl shadow-lg bg-black text-orange-300 max-w-[1000px] w-full">
            <div className="flex justify-between mb-4">
              <button onClick={() => navigate("/boxes")} className="bg-orange-500 text-black p-2 rounded">← Volver</button>
              <button className="bg-orange-500 text-black p-2 rounded">Gestionar Lista Productos</button>
              <button className="bg-orange-500 text-black p-2 rounded" onClick={handleCloseBox}>Cerrar Caja</button>
            </div>

            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full border-collapse text-center">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="border p-2">{flexRender(header.column.columnDef.header, header.getContext())}</th>
                      ))}
                      <th className="border p-2">Acciones</th>
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {sales.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="border p-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                        <td className="border p-2 flex justify-center space-x-2">
                          <button onClick={() => handleEdit(row.original)}>
                            <Pencil className="text-orange-500 cursor-pointer" />
                          </button>
                          <button onClick={() => handleDelete(row.original.id_venta)}>
                            <X className="text-red-500 cursor-pointer" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={table.getHeaderGroups()[0]?.headers.length + 1 || 1} className="text-center py-4">No hay ventas registradas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formulario de agregar venta */}
          <div className="p-4 border rounded-xl shadow-lg bg-black text-orange-300 max-w-[1000px] w-full">
            <div className="flex justify-between items-center">
              {/* Selección de producto, cantidad, método de pago y botón */}
              <select
                className="bg-orange-500 p-2 rounded text-black"
                value={selectedProduct}
                onChange={(e) => {
                  const productId = e.target.value;
                  setSelectedProduct(productId);
                  const selectedProd = productos.find(prod => prod.id_producto === parseInt(productId));
                  setPrecioProducto(selectedProd?.precio_producto || 0);
                }}
              >
                <option>Seleccionar Producto</option>
                {productos.map((producto) => (
                  <option key={producto.id_producto} value={producto.id_producto}>{producto.nombre_producto}</option>
                ))}
              </select>
              <input
                type="number"
                className="bg-orange-500 p-2 rounded text-black"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
              />
              <select
                className="bg-orange-500 p-2 rounded text-black"
                value={selectedMetodoPago ?? ""}
                onChange={(e) => setSelectedMetodoPago(parseInt(e.target.value))}
              >
                <option>Seleccionar Método de Pago</option>
                {metodosPago.map((metodo) => (
                  <option key={metodo.id_metodo_pago} value={metodo.id_metodo_pago}>
                    {metodo.tipo_metodo_pago}
                  </option>
                ))}
              </select>
              <button className="bg-orange-500 p-2 rounded" onClick={handleAddSale}>Agregar</button>
            </div>
          </div>

          {/* Muestra el total de todas las ventas */}
          <div className="p-4 border rounded-xl shadow-lg bg-black text-orange-300 max-w-[1000px] w-full mt-4">
            <h3 className="text-xl font-bold">Total de la venta: ${calcularTotal().toFixed(2)}</h3>
          </div>
          
          <ChartsDashboard sales={salesData} metodoPago={paymentPercentages} />

        </div>

        {isModalOpen && selectedSale && (
          <ModalEditSale
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            sale={selectedSale}
            productos={productos}
            metodosPago={metodosPago}
            onSave={handleSaveSale}
          />
        )}
    </div>
  );
};
  
  export default SalesForm;
