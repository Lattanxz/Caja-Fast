import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const StatisticsForm: React.FC = () => {
  const { token, userId, isLoggedIn, userRole } = useAuth();

  const [stats, setStats] = useState({
    totalVentas: 0,
    cajasCerradas: 0,
    productosVendidos: 0,
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Para manejar el estado de carga

  useEffect(() => {
    console.log("User ID:", userId); // Para depuración
    console.log("Is Logged In:", isLoggedIn); // Para depuración
    
    // Verifica que `userId` sea válido antes de continuar
    if (!isLoggedIn || !userId) {
      console.error("No se encontró el id_usuario o no está logeado");
      return;
    }
  
    const fetchStats = async () => {
      setLoading(true); // Inicia el loading
      try {
        console.log("Fetching statistics for user:", userId); // Depuración
        const response = await axios.get("http://localhost:3000/api/sales/statistics", {
          params: { id_usuario: userId },
        });
        console.log("Statistics Response:", response.data); // Depuración
        setStats(response.data);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setLoading(false); // Detiene el loading
      }
    };
  
    const fetchRevenueByDate = async () => {
      try {
        console.log("Fetching revenue by date for user:", userId); // Depuración
        const response = await axios.get("http://localhost:3000/api/sales/statisticsByDate", {
          params: { id_usuario: userId },
        });
        console.log("Revenue by Date Response:", response.data); // Depuración
        setRevenueData(response.data.revenueByDate || []); // Asegura que siempre sea un array
      } catch (error) {
        console.error("Error al obtener recaudación por fecha:", error);
      }
    };
  
    const fetchTopProducts = async () => {
      try {
        console.log("Fetching top products for user:", userId); // Depuración
        const response = await axios.get("http://localhost:3000/api/sales/statisticsByProducts", {
          params: { id_usuario: userId },
        });
  
        // Verificar directamente los datos
        console.log("Top Products Response:", response.data); // Depuración
  
        // Asegúrate de que la propiedad 'cantidadVendida' se está convirtiendo correctamente a número
        const products = response.data.map((product: any) => ({
          ...product,
          cantidadVendida: parseInt(product.cantidadVendida, 10), // Convertir cantidadVendida a número
        }));
        setTopProducts(products);
        
      } catch (error) {
        console.error("Error al obtener los productos más vendidos:", error);
      }
    };
  
    fetchStats();
    fetchRevenueByDate();
    fetchTopProducts();
  }, [userId, isLoggedIn]);
  

  useEffect(() => {
    console.log('Top products updated:', topProducts);  // Ahora deberías ver los productos actualizados
  }, [topProducts]);  // Este efecto se dispara solo cuando topProducts cambia

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE"];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-black py-4">
        <div className="container mx-auto px-6 text-white text-center">
          <h1 className="text-2xl font-bold">📊 ESTADÍSTICAS</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center text-xl text-gray-600">Cargando...</div>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Resumen General</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 shadow-md rounded-lg">
                  <h3 className="text-lg font-semibold">Total de Ventas</h3>
                  <p className="text-2xl font-bold text-green-500">${stats.totalVentas.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 shadow-md rounded-lg">
                  <h3 className="text-lg font-semibold">Cajas Cerradas 📦🔒</h3>
                  <p className="text-2xl font-bold text-blue-500">{stats.cajasCerradas}</p>
                </div>
                <div className="bg-white p-4 shadow-md rounded-lg">
                  <h3 className="text-lg font-semibold">Productos Vendidos</h3>
                  <p className="text-2xl font-bold text-purple-500">{stats.productosVendidos}</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Gráficos de Desempeño</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico de Recaudación por Fecha */}
                <div className="bg-white p-6 shadow-md rounded-lg flex items-center justify-center">
                  {revenueData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalRecaudado" fill="#4CAF50" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">No hay datos de recaudación disponibles</p>
                  )}
                </div>

                {/* Gráfico de Productos más Vendidos */}
                <div className="bg-white p-6 shadow-md rounded-lg flex items-center justify-center">
                  {topProducts.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={topProducts}
                          dataKey="cantidadVendida"
                          nameKey="nombre_producto"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {topProducts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">No hay datos de productos disponibles</p>
                  )}
                </div>
                
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};


export default StatisticsForm;
