import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Importa el hook de contexto
import HomeButton from "./HomeButton";
import ResetPassword from "./ResetPassword";
import authImage from "../assets/imgs/camarera-con-caja-registradora.jpeg";
import logo from "../assets/imgs/logo_transparent cut.png";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);

  // Accede al contexto de autenticación
  const { setIsLoggedIn, setUserRole } = useAuth();

  const toggleAuthForm = () => {
    setIsLogin(!isLogin);
    setForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const email_usuario = (e.target as HTMLFormElement).email_usuario.value;
    const password = (e.target as HTMLFormElement).password.value;

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_usuario, password }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log("Login exitoso:", data);

        // Guardar el token en localStorage
        localStorage.setItem("token", data.token);

        // Actualizar el estado de autenticación en el contexto
        setIsLoggedIn(true);
        setUserRole(data.role); // Guardar el rol del usuario en el contexto

        // Redirigir según el rol
        window.location.href = data.redirect;
      } else {
        console.error("Error al iniciar sesión:", data.mensaje);
        alert(data.mensaje); // Mostrar mensaje de error al usuario
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      alert(
        "Error al conectar con el servidor. Por favor, intenta nuevamente."
      );
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <img
          src={authImage}
          alt="Imagen decorativa"
          className="relative w-full object-cover object-center h-screen shadow-lg opacity-60"
        />
      </div>
      <div className="h-screen w-[100vh] flex items-center justify-center">
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border-2 border-gray-300">
          <HomeButton>
            <img
              src={logo}
              className="bg-gray-100 w-[120px] m-auto mb-4 cursor-pointer"
            />
          </HomeButton>
          <HomeButton>
            <h1 className="text-3xl font-normal text-black-500 cursor-pointer flex items-center justify-center mb-4">
              CAJA FAST
            </h1>
          </HomeButton>

          {forgotPassword ? (
            <ResetPassword onBack={() => setForgotPassword(false)} />
          ) : (
            <>
              <h2 className="text-4xl font-normal mb-6 text-center">
                {isLogin ? "BIENVENIDO DE VUELTA!" : "BIENVENIDO!"}
              </h2>
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-4">
                    <label className="block mb-1 font-light" htmlFor="name">
                      Nombre:
                    </label>
                    <input
                      type="text"
                      placeholder="Juan Jose"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label
                    className="block mb-1 font-light"
                    htmlFor="email_usuario"
                  >
                    Email o Nombre de usuario:
                  </label>
                  <input
                    type="email"
                    placeholder="nombre@mail.com"
                    id="email_usuario"
                    name="email_usuario"
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
                    name="password"
                    placeholder="********"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4 flex items-center flex-shrink-0">
                  <label className="inline-flex items-center flex-wrap">
                    <input
                      type="checkbox"
                      className="form-checkbox cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-500 hover:text-black cursor-pointer">
                      Recuérdame{" "}
                    </span>
                  </label>
                  <p
                    className="ml-28 text-sm text-gray-500 cursor-pointer hover:text-black"
                    onClick={handleForgotPassword}
                  >
                    ¿Olvidaste tu contraseña?
                  </p>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
