import LoggedBar from "./LoggedBar";
import { Upload, Pencil, Bolt, Check } from "lucide-react";

const ProfileForm = () => {
  return (
    <>
      {/* Barra (pronto a transformar en ) */}
      <LoggedBar />
      {/* Titulo y div main */}
      <main className="flex flex-col items-center justify-center mt-8">
        <h2 className="text-3xl font-semibold mb-6">PERFIL</h2>

        {/* Formulario del perfil */}
        <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-md border-4 border-orange-400">
          {/* Imagen del perfil */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-4 border-2 border-orange-400">
              {/* Espacio para la foto de perfil */}
              <span className="text-gray-500">Foto</span>
            </div>
            <button className="bg-orange-400 text-black px-4 py-2 rounded-lg flex items-center hover:bg-orange-500 my-2">
              <Upload className="w-4 h-4 mr-2" />
              Cargar Imagen
            </button>
          </div>

          {/* Formulario de datos */}
          <form>
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
                  placeholder="Jose Juan"
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
                  placeholder="mail@ejemplo.com"
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

            {/* Botones */}
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
