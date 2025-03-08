import React, { useState } from "react";

const UserForm = ({
  modalAction,
  selectedUser,
  onSubmit,
  onChangeEstado, // <-- Agregado aquí
}: {
  modalAction: "add" | "edit";
  selectedUser: {
    nombre_usuario?: string;
    email_usuario?: string;
    id_rol?: number;
    id_estado?: number;
    password?: string;
  } | null;
  onSubmit: (data: {
    nombre_usuario: string;
    email_usuario: string;
    id_estado: number;
    id_rol: number;
    password: string;
  }) => void;
  onChangeEstado?: React.Dispatch<React.SetStateAction<string>>; // <-- Agregado aquí
}) => {
  const [estado, setEstado] = useState(
    selectedUser?.id_estado?.toString() || "1"
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const nombre_usuario = formData.get("name") as string;
    const email_usuario = formData.get("email") as string;
    const id_rol = parseInt(formData.get("role") as string, 10);
    const password = formData.get("password") as string;
    const id_estado = parseInt(estado, 10);

    onSubmit({ nombre_usuario, email_usuario, id_rol, id_estado, password });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstado(e.target.value);
    if (onChangeEstado) {
      onChangeEstado(e.target.value); // <-- Llamamos a la función si está definida
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Nombre de usuario"
          defaultValue={modalAction === "edit" ? selectedUser?.nombre_usuario || "" : ""}
          className="w-full border border-gray-300 rounded p-2 text-black"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block">
          Email
        </label>
        <input
          placeholder="Email Personal"
          type="email"
          id="email"
          name="email"
          defaultValue={modalAction === "edit" ? selectedUser?.email_usuario || "" : ""}
          className="w-full border border-gray-300 rounded p-2 text-black"
          required
        />
      </div>
      <div>
        <label htmlFor="role" className="block">
          Rol
        </label>
        <select
          id="role"
          name="role"
          defaultValue={modalAction === "edit" ? selectedUser?.id_rol?.toString() || "2" : "2"}
          className="w-full border border-gray-300 rounded p-2 text-black"
          required
        >
          <option value="1">Usuario</option>
          <option value="2">Administrador</option>
        </select>
      </div>
      <div>
        <label htmlFor="estado" className="block">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          value={estado}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 text-black"
          required
        >
          <option value="1">Activo</option>
          <option value="2">Inactivo</option>
          <option value="3">Suspendido</option>
        </select>
      </div>
      <div>
        <label htmlFor="password" className="block">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder={modalAction === "edit" ? "Ingrese una nueva contraseña (opcional)" : "Ingrese una contraseña"}
          className="w-full border border-gray-300 rounded p-2 text-black"
          required={modalAction === "add"}
        />
      </div>
      <div className="flex">
        <button
          type="submit"
          className="bg-orange-400 text-black px-4 py-2 rounded-lg hover:bg-orange-500 m-auto"
        >
          {modalAction === "add" ? "AGREGAR" : "GUARDAR CAMBIOS"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
