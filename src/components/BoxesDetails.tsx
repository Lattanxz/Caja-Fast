import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import Navbar from "../components/Navbar"; // Asegúrate de importar el Navbar
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

interface ProductSold {
  nombre_producto: string;
  cantidad: number;
}

interface PaymentMethod {
  tipo_metodo_pago: string;
  monto: number;
  porcentaje: number;
}

interface BoxDetailsData {
  totalRecaudado: number;
  productosVendidos: ProductSold[];
  totalProductosVendidos: number;
  metodosPago: PaymentMethod[];
}

const COLORS = ["#4CAF50", "#8884d8", "#FFBB28", "#FF8042", "#82ca9d"];

const BoxDetails: React.FC = () => {
    const navigate = useNavigate(); // Hook para manejar la navegación
    const { userId, isLoggedIn, userRole } = useAuth(); // Obtener el userId del contexto
    const { id_caja } = useParams<{ id_caja: string }>();
    const idCaja = id_caja ? parseInt(id_caja) : null; // Convierte a número
    const [boxDetails, setBoxDetails] = useState<BoxDetailsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchBoxDetails = async () => {
        if (idCaja) {
          try {
            const response = await axios.get(`http://localhost:3000/api/boxes/getBoxDetails/${idCaja}`);
            setBoxDetails(response.data);
            console.log("Detalles de la caja:", response.data);
          } catch (err) {
            console.error("Error al obtener los detalles de la caja:", err);
            setError("Hubo un error al obtener los detalles de la caja.");
          } finally {
            setLoading(false);
          }
        }
      };
  
      fetchBoxDetails();
    }, [idCaja]);
  
    const handleBack = () => {
      navigate('/boxes'); // Redirige al usuario a /boxes
    };
  

    if (loading) return <div className="text-center text-xl text-gray-600">Cargando detalles...</div>;
  
    if (error) return <div className="text-center text-xl text-red-500">{error}</div>;
  
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Navbar */}
        <div className="w-full">
          <Navbar isLoggedIn={isLoggedIn} userRole={userRole ?? undefined} />
          
        </div>
  
        {/* Header */}
        <header className="bg-black py-4 w-full">
          <div className="container px-12 mx-auto text-sm text-black">
            <div className="flex justify-between items-center">
              <h1 className="text-center text-white text-2xl font-bold ">
              📊 ESTADÍSTICAS DE LA CAJA
              </h1>
              <div>
              <button 
                onClick={handleBack} 
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Volver
              </button>
            </div>
            </div>
          </div>
        </header>
  
        <main className="container mx-auto px-4 py-6">
          {/* Resumen General */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Resumen General</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 shadow-md rounded-lg text-center">
                <h3 className="text-lg font-semibold">Total Recaudado</h3>
                <p className="text-2xl font-bold text-green-500">
                  ${boxDetails?.totalRecaudado?.toFixed(2) ?? '0.00'}
                </p>
              </div>
              <div className="bg-white p-4 shadow-md rounded-lg text-center">
                <h3 className="text-lg font-semibold">Productos Vendidos</h3>
                <p className="text-2xl font-bold text-purple-500">
                  {boxDetails?.totalProductosVendidos ?? 0}
                </p>
              </div>
              <div className="bg-white p-4 shadow-md rounded-lg text-center">
                <h3 className="text-lg font-semibold">Métodos de Pago Usados</h3>
                <p className="text-2xl font-bold text-blue-500">
                  {boxDetails?.metodosPago?.length ?? 0}
                </p>
              </div>
            </div>
          </section>
  
          {/* Gráfico de Productos Vendidos */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Productos más Vendidos</h2>
            <div className="bg-white p-6 shadow-md rounded-lg flex items-center justify-center">
              {boxDetails?.productosVendidos?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={boxDetails.productosVendidos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre_producto" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cantidad" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">No hay datos de productos disponibles</p>
              )}
            </div>
          </section>
  
          {/* Gráfico de Métodos de Pago */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Uso de Métodos de Pago</h2>
            <div className="bg-white p-6 shadow-md rounded-lg flex items-center justify-center">
                {boxDetails?.metodosPago?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                    <Pie
                        data={boxDetails.metodosPago}
                        dataKey="porcentaje"
                        nameKey="tipo_metodo_pago"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#82ca9d"
                        label={({ name, porcentaje }) => `${name}: ${porcentaje}%`}  // Mostrar el porcentaje como cadena
                    >
                        {boxDetails.metodosPago.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
                ) : (
                <p className="text-gray-500">No hay datos de métodos de pago disponibles</p>
                )}
            </div>
            </section>
        </main>
      </div>
    );
  };
  
  export default BoxDetails;
  
