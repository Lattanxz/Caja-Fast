import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Upload, Pencil, Bolt, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Usamos el hook useAuth
import axios from "axios";

const ProfileForm = () => {
  const { userId, token } = useAuth(); // Acceder a userId y token con useAuth
  const [name, setName] = useState(""); // Estado para el nombre
  const [email, setEmail] = useState(""); // Estado para el email
  const [loading, setLoading] = useState(true); // Estado para la carga de datos

  // Obtener los datos del perfil cuando el componente se monta
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId || !token) return;

        // Hacer una solicitud GET para obtener los datos del perfil
        const response = await axios.get(
          `http://localhost:3000/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Establecer los datos del usuario en el estado local
        setName(response.data.nombre_usuario);
        setEmail(response.data.email_usuario);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del perfil:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token]);

  /* Función para manejar la actualización del perfil */
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(token);
    try {
      const response = await axios.put(
        "http://localhost:3000/api/profile",
        {
          nombre_usuario: name,
          email_usuario: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Perfil actualizado con éxito");
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un error al actualizar el perfil");
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Navbar isLoggedIn={true} />
      <header className="bg-black py-4">
        <div className="container px-12 mx-auto relative text-sm text-black">
          <div className="flex justify-between items-center">
            <h1 className="text-center text-white text-2xl font-bold">
              PERFIL
            </h1>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center mt-8">
        <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-md border-4 border-orange-400">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-4 border-2 border-orange-400">
              <span className="text-gray-500">Foto</span>
            </div>
            <button className="bg-orange-400 text-black px-4 py-2 rounded-lg flex items-center hover:bg-orange-500 my-2">
              <Upload className="w-4 h-4 mr-2" />
              Cargar Imagen
            </button>
          </div>

          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-extralight mb-1"
              >
                Nombre y apellido
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-black border rounded-lg"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500"
                >
                  <Pencil className="hover:text-black" />
                </button>
              </div>
            </div>

            <div className="mb-10">
              <label
                htmlFor="email"
                className="block text-sm font-extralight mb-1"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-black border rounded-lg"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500"
                >
                  <Pencil className="hover:text-black" />
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="button"
                className="bg-orange-400 text-black px-4 py-2 rounded-lg hover:bg-orange-500 flex items-center justify-center mb-6"
              >
                <Bolt className="w-4 h-4 mr-2 items-center " />
                Cambiar contraseña
              </button>
              <button
                type="submit"
                className="bg-orange-400 text-black px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center mb-6"
              >
                <Check className="w-4 h-4 mr-2 items-center" />
                Actualizar perfil
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default ProfileForm;
