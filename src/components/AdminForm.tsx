import { useState, useEffect } from "react";
import axios from "axios"; // Importar axios
import Navbar from "./Navbar";
import ModalUser from "./ModalUser";
import ModalReusable from "./ModalReusable";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, Pencil, X } from "lucide-react";

interface User {
  id_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
  rol_usuario: string;
  password: string;
}

const AdminForm = () => {
  // Usar el contexto de autenticación
  const { isLoggedIn, userRole } = useAuth();

  /* Constantes modal doble */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]); // Inicializar como arreglo vacío

  /* Modal de confirmación */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Obtener los usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users"); // Llamada a la API
        if (Array.isArray(response.data)) {
          setUsers(response.data); // Actualizar el estado solo si es un arreglo
        } else {
          console.error("La respuesta no es un arreglo:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsers(); // Ejecutar la llamada cuando se monta el componente
  }, []); // Solo se ejecuta una vez al montar el componente

  const handleOpenModal = (
    action: "add" | "edit",
    user: User | null = null
  ) => {
    setModalAction(action);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await axios.delete(
          `http://localhost:3000/api/users/${userToDelete.id_usuario}`
        ); // Llamada a la API para eliminar usuario
        setUsers(users.filter((u) => u.id_usuario !== userToDelete.id_usuario)); // Eliminar del estado local
        handleCloseDeleteModal();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    } else {
      console.error("No user selected for deletion");
    }
  };

  const handleSubmitUser = async ({
    nombre_usuario,
    email_usuario,
    rol_usuario,
    password,
  }: {
    nombre_usuario: string;
    email_usuario: string;
    rol_usuario: string;
    password: string;
  }) => {
    if (modalAction === "add") {
      try {
        const response = await axios.post("http://localhost:3000/api/users", {
          nombre_usuario,
          email_usuario,
          rol_usuario,
          password,
        });
        setUsers([...users, response.data]); // Agregar el usuario al estado
        handleCloseModal();
      } catch (error) {
        console.error("Error al agregar el usuario:", error);
      }
    } else if (modalAction === "edit" && selectedUser) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/users/${selectedUser.id_usuario}`,
          {
            nombre_usuario,
            email_usuario,
            rol_usuario,
            password,
          }
        );
        setUsers(
          users.map((u) =>
            u.id_usuario === selectedUser.id_usuario
              ? { ...u, ...response.data }
              : u
          )
        );
        handleCloseModal();
      } catch (error) {
        console.error("Error al editar el usuario:", error);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center">
        <h1>Por favor, inicie sesión para acceder a esta página.</h1>
      </div>
    );
  }

  // Opcionalmente, puedes hacer algo con el rol, por ejemplo:
  if (userRole !== "administrador") {
    return (
      <div className="text-center">
        <h1>No tienes permisos para acceder a esta página.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación */}
      <Navbar isLoggedIn={true} />
      <header className="bg-black py-4">
        <div className="container px-12 mx-auto relative text-sm text-black">
          <div className="flex justify-between items-center">
            <h1 className="text-center text-white text-2xl font-bold">
              VISTA DE USUARIOS
            </h1>
            <button
              className="bg-orange-400 text-black px-4 py-2 rounded-lg flex items-center hover:bg-orange-500"
              onClick={() => handleOpenModal("add")}
            >
              AGREGAR USUARIO
              <PlusCircle className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      {/* Tabla de usuarios */}
      <div className="overflow-x-auto mt-8">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-black text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">NOMBRE</th>
              <th className="border border-gray-300 px-4 py-2">EMAIL</th>
              <th className="border border-gray-300 px-4 py-2">ROL</th>
              <th className="border border-gray-300 px-4 py-2">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {/* Verificar que 'users' sea un arreglo antes de llamar a 'map' */}
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id_usuario}
                  className="even:bg-gray-100 hover:bg-gray-200 transition"
                >
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {user.nombre_usuario}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {user.email_usuario}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {user.rol_usuario}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {/* Botones de acción */}
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
                      onClick={() => handleOpenDeleteModal(user)}
                    >
                      <X />
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => handleOpenModal("edit", user)}
                    >
                      <Pencil />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal de añadir o editar */}
      <ModalReusable
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalAction === "add" ? "Agregar usuario" : "Editar usuario"}
      >
        <ModalUser
          modalAction={modalAction}
          selectedUser={selectedUser}
          onSubmit={handleSubmitUser}
        />
      </ModalReusable>
      {/* Modal de confirmación para eliminar */}
      <ModalReusable
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Confirmar eliminación"
      >
        <p className="text-center mb-6">
          ¿Estás seguro de que deseas eliminar al usuario{" "}
          <strong>{userToDelete?.nombre_usuario}</strong>?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={handleDeleteUser}
          >
            Sí, eliminar
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
            onClick={handleCloseDeleteModal}
          >
            No, cancelar
          </button>
        </div>
      </ModalReusable>
    </div>
  );
};

export default AdminForm;
