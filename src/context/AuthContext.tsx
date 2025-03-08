import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Definir los tipos de estado
interface AuthContextType {
  isLoggedIn: boolean;
  userRole: number | null;
  userId: number | null;
  emailUsuario: string | null; // Agregado email_usuario
  token: string | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserRole: React.Dispatch<React.SetStateAction<number | null>>;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
  setEmailUsuario: React.Dispatch<React.SetStateAction<string | null>>; // Setter para email_usuario
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  error: string | null;
  logout: () => void; // Nueva función logout
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthStatusResponse {
  isLoggedIn: boolean;
  role: number;
  userId: number;
  emailUsuario: string; // Agregado email_usuario
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [emailUsuario, setEmailUsuario] = useState<string | null>(null); // Estado para email_usuario
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        if (!token) {
          setIsLoggedIn(false);
          setError("No token found.");
          return;
        }

        const decodedToken = jwtDecode(token) as {
          exp: number;
          id_usuario: number;
          email_usuario: string; // Decodificar email_usuario también
        };

        const currentDate = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentDate) {
          setIsLoggedIn(false);
          setError("El token ha expirado.");
          return;
        }

        const response = await axios.get<AuthStatusResponse>(
          "http://localhost:3000/api/auth/status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (!isCancelled) {
          setIsLoggedIn(response.data.isLoggedIn);
          setUserRole(response.data.role);
          setUserId(decodedToken.id_usuario);
          setEmailUsuario(decodedToken.email_usuario);
          setToken(token);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setIsLoggedIn(false);
          setUserRole(null);
          setUserId(null);
          setEmailUsuario(null);
          setError("No se pudo verificar el estado de autenticación.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    checkAuthStatus();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  // Función logout
  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserId(null);
    setEmailUsuario(null);
    setToken(null);
    localStorage.removeItem("token"); // Eliminar el token de localStorage
    // Aquí también puedes hacer una llamada al backend para limpiar las cookies
    axios
      .post("http://localhost:3000/api/auth/logout") // Asegúrate de tener el endpoint correcto
      .then(() => {
        console.log("Sesión cerrada correctamente");
      })
      .catch((err) => {
        console.error("Error al cerrar sesión en el servidor", err);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        userId,
        emailUsuario,
        token,
        setIsLoggedIn,
        setUserRole,
        setUserId,
        setEmailUsuario,
        setToken,
        loading,
        error,
        logout, // Proveer la función logout en el contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
