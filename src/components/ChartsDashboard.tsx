import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

export interface SalesData {
  nombre_producto: string;
  cantidad: number;
  tipo_metodo_pago: string;
  total: number | undefined;
}

interface MetodoPago {
  name: string;
  value: number;
}

interface ChartsDashboardProps {
  sales: SalesData[];
  metodoPago: MetodoPago[];
}

const ChartsDashboard: React.FC<ChartsDashboardProps> = ({ sales, metodoPago }) => {
  console.log("Sales Data:", sales); // Para depuración
  console.log("MetodoPago Data:", metodoPago); // Para depuración

  // Agrupar ventas por producto y sumar la cantidad total
  const ventasPorProducto = Object.values(sales.reduce((acc, sale) => {
    if (!acc[sale.nombre_producto]) {
      acc[sale.nombre_producto] = { name: sale.nombre_producto, value: 0 };
    }
    acc[sale.nombre_producto].value += sale.cantidad;
    return acc;
  }, {} as Record<string, { name: string; value: number }>));

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-6">
      {/* Gráfico de Barras */}
      <ResponsiveContainer width={400} height={300}>
        <BarChart data={ventasPorProducto}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Gráfico de Pastel */}
      <ResponsiveContainer width={400} height={300}>
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie data={metodoPago} dataKey="value" nameKey="name" fill="#82ca9d" label />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartsDashboard;
