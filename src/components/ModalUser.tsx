import React from "react";

const UserForm = ({
  modalAction,
  selectedUser,
  onSubmit,
}: {
  modalAction: "add" | "edit";
  selectedUser: any;
  onSubmit: (data: { name: string; email: string; role: string }) => void;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    onSubmit({ name, email, role });
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
          defaultValue={modalAction === "edit" ? selectedUser?.name : ""}
          className="w-full border border-gray-300 rounded p-2 text-black"
        />
      </div>
      <div>
        <label htmlFor="email" className="block">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={modalAction === "edit" ? selectedUser?.email : ""}
          className="w-full border border-gray-300 rounded p-2 text-black"
        />
      </div>
      <div>
        <label htmlFor="role" className="block">
          Rol
        </label>
        <select
          id="role"
          name="role"
          defaultValue={modalAction === "edit" ? selectedUser?.role : "user"}
          className="w-full border border-gray-300 rounded p-2 text-black"
        >
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
        </select>
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
