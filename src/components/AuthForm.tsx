import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authImage from "../assets/imgs/camarera-con-caja-registradora.jpeg";
import logo from "../assets/imgs/logo_transparent cut.png";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const toggleAuthForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <div className="h-screen flex">
        <div className=" w-1/2 flex items-center justify-center bg-gray-100">
          <img
            src={authImage}
            alt="Imagen decorativa"
            className="relative w-full object-cover object-center h-screen shadow-lg opacity-60"
          />
        </div>
        <div className="h-screen w-[100vh] flex items-center justify-center">
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg border-2 border-gray-300">
            <div
              className="flex items-center justify center"
              onClick={handleHomeClick}
            >
              <img
                src={logo}
                className="bg-gray-100 w-[120px] m-auto mb-4  cursor-pointer"
              />
            </div>
            <div
              className="flex items-center justify-center mb-4"
              onClick={handleHomeClick}
            >
              <h1 className="text-3xl font-normal text-black-500 cursor-pointer">
                CAJA FAST
              </h1>
            </div>
            <h2 className="text-4xl font-normal mb-6 text-center">
              {isLogin ? "BIENVENIDO DE VUELTA!" : "BIENVENIDO!"}
            </h2>
            <form>
              {!isLogin && (
                <div className="mb-4">
                  <label className="block mb-1 font-light" htmlFor="name">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    placeholder="Juan Jose"
                    id="name"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block mb-1 font-light" htmlFor="email">
                  Email o Nombre de usuario:
                </label>
                <input
                  type="email"
                  placeholder="nombre@mail.com"
                  id="email"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-light" htmlFor="password">
                  Contraseña:
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="********"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {!isLogin && (
                <div className="mb-4">
                  <label
                    className="block mb-1 font-light"
                    htmlFor="confirm-password"
                  >
                    Repetir Contraseña:
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    placeholder="********"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="inline-flex items-center flex-wrap ">
                  <input
                    type="checkbox"
                    className="form-checkbox cursor-pointer "
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    Recuérdame{" "}
                  </span>
                  <p className="ml-28 text-sm text-gray-500 cursor-pointer hover:text-black">
                    ¿Olvidaste tu contraseña?
                  </p>
                </label>
              </div>

              <button
                type="submit"
                className="bg-orange-400 text-black px-4 py-2 rounded-lg hover:bg-orange-500 w-full mt-3 mb-4 h-16"
              >
                {isLogin ? "Iniciar sesión" : "Registrarse"}
              </button>

              <div className="text-center text-sm text-gray-500 my-6">
                {isLogin ? (
                  <p>
                    ¿No tienes una cuenta?{" "}
                    <a
                      href="#"
                      className="text-gray-600 font-semibold hover:text-black"
                      onClick={toggleAuthForm}
                    >
                      Regístrate
                    </a>
                  </p>
                ) : (
                  <p>
                    ¿Ya tienes una cuenta?{" "}
                    <a
                      href="#"
                      className="text-gray-600 font-semibold hover:text-black"
                      onClick={toggleAuthForm}
                    >
                      Inicia sesión
                    </a>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
