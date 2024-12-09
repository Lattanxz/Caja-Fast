import { infoUser, User } from "../assets/constants";
import { PlusCircle, Pencil, X } from "lucide-react";
import { useState } from "react";
import Navbar from "./Navbar";
import ModalUser from "./ModalUser";
import ModalReusable from "./ModalReusable";

const AdminForm = () => {
  /* Constantes modal doble */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(infoUser);

  /* Modal de confirmación */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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

  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      handleCloseDeleteModal();
    } else {
      console.error("No user selected for deletion");
    }
  };

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
              {<PlusCircle className="ml-2 w-5 h-5" />}
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
            {users.map((user) => (
              <tr
                key={user.id}
                className="even:bg-gray-100 hover:bg-gray-200 transition"
              >
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {user.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {user.role}
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
            ))}
          </tbody>
        </table>
      </div>
      {/*Modal añadir*/}
      <ModalReusable
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalAction === "add" ? "Agregar usuario" : "Editar usuario"}
      >
        <ModalUser
          modalAction={modalAction}
          selectedUser={selectedUser}
          onSubmit={({ name, email, role }) => {
            if (modalAction === "add") {
              const newUser = {
                id: Date.now(), // ID único temporal
                name,
                email,
                role,
              };
              setUsers([...users, newUser]);
            } else if (modalAction === "edit" && selectedUser) {
              setUsers(
                users.map((u) =>
                  u.id === selectedUser.id ? { ...u, name, email, role } : u
                )
              );
            }
            handleCloseModal();
          }}
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
          <strong>{userToDelete?.name}</strong>?
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
