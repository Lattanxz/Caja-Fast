import { infoUser } from "../assets/constants";
import { PlusCircle } from "lucide-react";
import LoggedBar from "./LoggedBar";

const AdminForm = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación */}
      <LoggedBar />

      <header className="bg-black py-4">
        <div className="container px-12 mx-auto relative text-sm text-black">
          <div className="flex justify-between items-center">
            <h1 className="text-center text-white text-2xl font-bold">
              VISTA DE USUARIOS
            </h1>
            <button className="bg-orange-400 text-black px-4 py-2 rounded-lg flex items-center hover:bg-orange-500">
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
            {infoUser.map((user) => (
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
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2">
                    ✖
                  </button>
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    ✏
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminForm;
