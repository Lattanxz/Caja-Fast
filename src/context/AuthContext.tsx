import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode"; // Asegúrate de que esta importación es correcta
import axios from "axios";

// Definir los tipos de estado
interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string;
  userId: number | null;
  token: string | null; // Agregar token al contexto
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>; // Función para actualizar el token
  loading: boolean;
  error: string | null;
}

// Tipo para los props del proveedor
interface AuthProviderProps {
  children: ReactNode;
}

// Tipo para la respuesta de la API
interface AuthStatusResponse {
  isLoggedIn: boolean;
  role: string;
  userId: number;
}

// Crear el contexto con un valor inicial vacío pero con el tipo adecuado
const AuthContext = createContext<AuthContextType | null>(null);

// Proveedor del contexto
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>(""); // Mantener el rol
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Verificar sesión al cargar la página
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);

        if (!token) {
          setIsLoggedIn(false);
          setError("No token found.");
          return;
        }

        // Verifica el token en consola antes de usarlo
        console.log("Token en AuthContext:", token);

        // Decodificar el token para verificar si está expirado
        const decodedToken = jwtDecode(token) as {
          exp: number;
          id_usuario: number;
        };
        console.log("Token decodificado:", decodedToken);

        const currentDate = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentDate) {
          console.log("El token ha expirado.");
          setIsLoggedIn(false);
          setError("El token ha expirado.");
          return;
        }

        // Solicitud al backend
        const response = await axios.get<AuthStatusResponse>(
          "http://localhost:3000/api/auth/status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setIsLoggedIn(response.data.isLoggedIn);
        setUserRole(response.data.role || "");
        setUserId(decodedToken.id_usuario || null);
        setToken(token);
        setError(null);
        console.log("Estado de autenticación:", response.data);
      } catch (err) {
        setIsLoggedIn(false);
        setUserRole("");
        setUserId(null);
        setError("No se pudo verificar el estado de autenticación.");
        console.error("Error al verificar el estado de autenticación:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        userId,
        token, // Ahora puedes acceder al token desde cualquier componente
        setIsLoggedIn,
        setUserRole,
        setUserId,
        setToken, // Proporcionamos el setter para actualizar el token
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto en cualquier parte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
