import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface ResetPasswordModalProps {
  onClose: () => void;
  onCodeVerified: (code: string) => Promise<void>;
  onPasswordReset: () => Promise<void>;
  isCodeVerified: boolean;
  isResetPassword: boolean; // Nueva propiedad añadida
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  onClose,
  onCodeVerified,
  onPasswordReset,
  isCodeVerified,
  isResetPassword, // Se incluye en los parámetros del componente
  newPassword,
  setNewPassword,
}) => {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const { emailUsuario } = useAuth();  // Obtener email desde el contexto



  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Enviando datos a /api/auth/verify-code:", {
        email_usuario: emailUsuario,
        verification_code: code,
      });
    
      const response = await axios.post(
        "http://localhost:3000/api/auth/verify-code",
        JSON.stringify({ email_usuario: emailUsuario, verification_code: code }), // Convertir a JSON
        {
          headers: { "Content-Type": "application/json" }, // Asegurar Content-Type
        }
      );
    
      if (response.status === 200) {
        await onCodeVerified(code);
        setErrorMessage("");
      } else {
        setErrorMessage("Código incorrecto. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al verificar el código:", error);
      setErrorMessage("Hubo un problema con la verificación del código.");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setErrorPassword("La nueva contraseña no puede estar vacía.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/reset-password`,
        { newPassword }
      );

      if (response.status === 200) {
        await onPasswordReset();
        onClose();
      } else {
        setErrorPassword("Hubo un problema al restablecer la contraseña.");
      }
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
      setErrorPassword("Hubo un problema al restablecer la contraseña.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Restablecer Contraseña</h2>

        {!isCodeVerified ? (
          <form onSubmit={handleSubmitCode}>
            <div className="mb-4">
              <label htmlFor="code" className="block mb-1">
                Código de Verificación
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Verificar Código
            </button>
          </form>
        ) : !isResetPassword ? (
          <form onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errorPassword && (
                <p className="text-red-500 text-sm mt-2">{errorPassword}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg"
            >
              Restablecer Contraseña
            </button>
          </form>
        ) : (
          <p className="text-green-600 text-center font-semibold">
            ¡Contraseña restablecida con éxito!
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-gray-500 hover:text-black"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
