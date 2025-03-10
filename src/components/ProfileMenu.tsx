import { Menu, MenuItem, MenuDivider, MenuGroup } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { User, Edit3, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const ProfileMenu = () => {
  const { isLoggedIn, setIsLoggedIn, userId, token, logout } = useAuth(); // Obtenemos logout
  const [userData, setUserData] = useState<{ name: string; role: string }>({
    name: "",
    role: "",
  });
  const navigate = useNavigate();
  
  // Obtener la información del usuario desde la API usando axios
  useEffect(() => {
    if (userId && token) {
      console.log("userId y token están disponibles, haciendo la solicitud");
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Agrega el token JWT en el encabezado
              },
            }
          );
  
          // Verificar los datos que recibe la API
          console.log("Respuesta de la API:", response.data);
  
          // Si la respuesta es exitosa, actualiza el estado del usuario
          if (response.status === 200) {
            const roleName = response.data.id_rol === 1 ? "Usuario" : response.data.id_rol === 2 ? "Administrador" : "Rol no disponible";
            setUserData({
              name: response.data.nombre_usuario || "Nombre no disponible",
              role: roleName, // Aquí transformamos el id_rol en el nombre del rol
            });
          } else {
            console.error(
              "Error al obtener los datos del usuario:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };
  
      fetchUserData();
    } else {
      console.log("userId o token no están disponibles");
    }
  }, [userId, token]);
  

  // Manejar el cierre de sesión usando axios
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agrega el token JWT para logout
          },
          withCredentials: true, // Si usas cookies para la sesión
        }
      );

      // Si la respuesta es exitosa, actualiza el estado de autenticación
      if (response.status === 200) {
        logout(); // Limpiar el contexto de autenticación

        // Redirige al usuario a la página de login
        navigate("/auth");
      } else {
        console.error("Error al cerrar sesión:", response.statusText);
        alert(
          "Hubo un problema al cerrar la sesión. Por favor, intenta de nuevo."
        );
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Ocurrió un error al cerrar la sesión. Revisa tu conexión.");
    }
  };

  return (
    <Menu
      menuButton={
        <button className="flex items-center bg-black p-2 rounded-full cursor-pointer">
          <User className="text-white w-5 h-5" />
        </button>
      }
      direction="bottom"
      align="end"
      menuClassName="w-60 rounded-lg shadow-lg border"
    >
      {/* Foto y detalles del usuario */}
      <div className="p-4 flex flex-col items-center">
        <img
          src="https://via.placeholder.com/60"
          alt="Foto de perfil"
          className="w-16 h-16 rounded-full mb-2"
        />
        <h3 className="text-lg font-semibold">
          {userData.name || "Nombre del Usuario"}
        </h3>
        <p className="text-sm">{userData.role || "Rol o descripción"}</p>
      </div>
      <MenuDivider />
      {/* Opciones del menú */}
      <MenuGroup className={"text-black"}>
        <ProfileButton>
          <MenuItem className={"hover:bg-gray-500 "}>
            <User className="w-5 h-5 mr-2 " />
            Mi Perfil
          </MenuItem>
          <MenuItem className={"hover:bg-gray-500 "}>
            <Edit3 className="w-5 h-5 mr-2 " />
            Editar Perfil
          </MenuItem>
        </ProfileButton>
        <MenuDivider />
        {/* Botón de cerrar sesión */}
        <MenuItem className={"hover:bg-gray-500 "} onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-2 " />
          Cerrar Sesión
        </MenuItem>
      </MenuGroup>
    </Menu>
  );
};

export default ProfileMenu;
