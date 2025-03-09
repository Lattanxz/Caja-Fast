import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Asegúrate de importar el hook useAuth
import { Toaster } from "sonner"; // Importa Sonner
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import StateBar from "./components/StateBar";
import Information from "./components/Information";
import BottomBar from "./components/BottomBar";
import AuthForm from "./components/AuthForm";
import ProfileForm from "./components/ProfileForm";
import BoxesForm from "./components/BoxesForm";
import AdminForm from "./components/AdminForm";
import SalesForm from "./components/SalesForm"; // Asegúrate de importar SalesForm
import ProductsForm from "./components/ProductsForm";
import ListForm from "./components/ListForm";
import StatisticsForm from "./components/StatisticsForm";
import { useState } from "react";
import "./App.css";

function App() {
  const [listas, setListas] = useState<any[]>([]);

  // Función para manejar el guardado de las listas
  const handleSave = (nombre: string, productos: any[]) => {
    console.log("Lista guardada", nombre, productos);
    // Aquí puedes agregar lógica para guardar la lista en el servidor
  };

  // Función para manejar el cierre del formulario
  const handleClose = () => {
    console.log("Formulario cerrado");
    // Aquí puedes agregar lógica para cerrar el formulario, como cambiar el estado
  };

  return (
    <AuthProvider>
      <Toaster position="top-right" richColors /> {/* Aquí va el Toaster */}
      <Router>
        <AppWithAuth /> {/* Componente envuelto con AuthProvider */}
      </Router>
    </AuthProvider>
  );
}

function AppWithAuth() {
  const { isLoggedIn, userRole } = useAuth(); // Aquí usamos useAuth dentro de AppWithAuth

  const [listas, setListas] = useState<any[]>([]);

  const handleSave = (nombre: string, productos: any[]) => {
    console.log("Lista guardada", nombre, productos);
  };

  const handleClose = () => {
    console.log("Formulario cerrado");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar isLoggedIn={isLoggedIn} userRole={userRole ?? undefined} />
            <div className="relative bg-bodyImage bg-cover bg-center h-[90vh] w-screen mx-auto pt-4">
              <div className="absolute inset-0 bg-white opacity-60"></div>
              <Body />
            </div>
            <StateBar />
            <Information />
            <BottomBar />
          </>
        }
      />

      <Route path="/auth" element={<AuthForm />} />
      <Route path="/boxes" element={<BoxesForm />} />
      <Route path="/product" element={<ProductsForm />} />
      <Route
        path="/list"
        element={
          <ListForm
            initialListas={listas}
            onSave={handleSave}
            onClose={handleClose}
          />
        }
      />  
      <Route path="/statistics" element={<StatisticsForm />} />
      <Route path="/users" element={<AdminForm />} />
      <Route path="/profile" element={<ProfileForm />} />
      <Route path="/sales/:id_caja" element={<SalesForm />} />
    </Routes>
  );
}

export default App;
