const UserForm = ({
  modalAction,
  selectedUser,
  onSubmit,
}: {
  modalAction: "add" | "edit";
  selectedUser: any; // Tipo de usuario según el modelo
  onSubmit: (data: {
    nombre_usuario: string;
    email_usuario: string;
    rol_usuario: string;
    password: string; // Agregar password aquí
  }) => void; // Cambié los nombres de las propiedades
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nombre_usuario = formData.get("name") as string;
    const email_usuario = formData.get("email") as string;
    const rol_usuario = formData.get("role") as string;
    const password = formData.get("password") as string; // Obtener el valor de la contraseña

    onSubmit({ nombre_usuario, email_usuario, rol_usuario, password }); // Ahora se incluye la contraseña
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
          defaultValue={
            modalAction === "edit" ? selectedUser?.nombre_usuario : ""
          }
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
          defaultValue={
            modalAction === "edit" ? selectedUser?.email_usuario : ""
          }
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
          defaultValue={
            modalAction === "edit" ? selectedUser?.rol_usuario : "user"
          }
          className="w-full border border-gray-300 rounded p-2 text-black"
        >
          <option value="administrador">Administrador</option>
          <option value="usuario">Usuario</option>
        </select>
      </div>
      {/* Campo de contraseña */}
      <div>
        <label htmlFor="password" className="block">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          defaultValue={modalAction === "edit" ? selectedUser?.password : ""}
          className="w-full border border-gray-300 rounded p-2 text-black"
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
