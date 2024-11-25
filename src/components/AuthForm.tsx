import { useLocation } from "react-router-dom";
import authImage from "../assets/imgs/camarera-con-caja-registradora.jpeg";

const AuthForm = () => {
  const location = useLocation();
  const { type } = location.state || {};
  const isLogin = type === "login";

  return (
    <>
      <div className="h-screen flex">
        <div className=" w-1/2 flex items-center justify-center bg-gray-100">
          <img
            src={authImage}
            alt="Imagen decorativa"
            className="relative w-full object-cover object-center h-screen  shadow-lg opacity-60"
          />
        </div>
        <div className="h-screen w-[100vh] flex items-center justify-center">
          <div className="p-6 bg-orange-400 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-4">
              {isLogin ? "Iniciar sesión" : "Registrarse"}
            </h2>
            <form>
              {!isLogin && (
                <div className="mb-4">
                  <label className="block mb-1 font-semibold " htmlFor="name">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block mb-1 font-semibold" htmlFor="email">
                  Correo Electrónico:
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold" htmlFor="password">
                  Contraseña:
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                {isLogin ? "Iniciar sesión" : "Registrarse"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
