import { useState } from "react";
import Notification from "./NotificationMessage";

const ResetPassword = ({ onBack }: { onBack: () => void }) => {
  const [verificationStep, setVerificationStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const showMessage = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (verificationStep === 1) {
        // Enviar correo con código de recuperación
        const response = await fetch("http://localhost:3000/api/auth/request-password-reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email_usuario: email }),
        });

        const data = await response.json();

        if (response.ok) {
          showMessage("Correo de recuperación enviado.");
          setVerificationStep(2);
        } else {
          showMessage(data.mensaje || "Error al enviar el correo.");
        }
      } else if (verificationStep === 2) {
        // Validar código de recuperación
        const response = await fetch("http://localhost:3000/api/auth/verify-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email_usuario: email, verification_code: verificationCode }),
        });

        const data = await response.json();

        if (response.ok) {
          showMessage("Código verificado correctamente.");
          setUserId(data.id_usuario); // Guardar el ID del usuario en el estado
          setVerificationStep(3);
        } else {
          showMessage(data.mensaje || "Código incorrecto.");
        }
      } else if (verificationStep === 3) {
        // Validar que las contraseñas coincidan
        if (newPassword !== confirmNewPassword) {
          showMessage("Las contraseñas no coinciden.");
          return;
        }

        console.log("ID Usuario para mi resetpassword:", userId);
        console.log("Nueva Contraseña de mi resetpassword:", newPassword);

        // Enviar nueva contraseña al backend
        const response = await fetch("http://localhost:3000/api/auth/update-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_usuario: userId, nueva_contrasena: newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
          showMessage("Contraseña actualizada correctamente.");
          onBack(); // Volver a la pantalla anterior o al login
        } else {
          showMessage(data.mensaje || "Error al actualizar la contraseña.");
        }
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      showMessage("Hubo un problema con la solicitud.");
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-normal mb-6 text-center">
        Recuperar contraseña
      </h2>
      <Notification
        show={notification.show}
        message={notification.message}
        onClose={() => setNotification({ show: false, message: "" })}
      />
      <form onSubmit={handleVerification}>
        {verificationStep === 1 && (
          <div className="mb-4">
            <label className="block mb-1 font-light" htmlFor="email">
              Ingresa tu correo electrónico:
            </label>
            <input
              type="email"
              id="email"
              placeholder="nombre@mail.com"
              className="w-full px-3 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        {verificationStep === 2 && (
          <div className="mb-4">
            <label className="block mb-1 font-light" htmlFor="code">
              Ingresa el código que recibiste:
            </label>
            <input
              type="text"
              id="code"
              placeholder="123456"
              className="w-full px-3 py-2 border rounded-lg"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
        )}

        {verificationStep === 3 && (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-light" htmlFor="new-password">
                Nueva contraseña:
              </label>
              <input
                type="password"
                id="new-password"
                placeholder="********"
                className="w-full px-3 py-2 border rounded-lg"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-1 font-light"
                htmlFor="confirm-new-password"
              >
                Repetir nueva contraseña:
              </label>
              <input
                type="password"
                id="confirm-new-password"
                placeholder="********"
                className="w-full px-3 py-2 border rounded-lg"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="bg-orange-400 text-black px-4 py-2 rounded-lg hover:bg-orange-500 w-full mt-3 mb-4 h-16"
        >
          {verificationStep === 1
            ? "Enviar código"
            : verificationStep === 2
            ? "Verificar código"
            : "Actualizar contraseña"}
        </button>
        <button
          type="button"
          className="text-sm text-gray-500 hover:text-black w-full"
          onClick={onBack}
        >
          Volver
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
