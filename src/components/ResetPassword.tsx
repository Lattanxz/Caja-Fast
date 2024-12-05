import { useState } from "react";
import Notification from "./NotificationMessage";

const ResetPassword = ({ onBack }) => {
  const [verificationStep, setVerificationStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const showMessage = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationStep === 1) {
      showMessage(`Código enviado al correo: ${email}`);
      setVerificationStep(2);
    } else if (verificationStep === 2) {
      if (verificationCode === "123456") {
        showMessage("Código verificado correctamente.");
        setVerificationStep(3);
      } else {
        showMessage("Código incorrecto. Inténtalo de nuevo.");
      }
    } else if (verificationStep === 3) {
      if (newPassword === confirmNewPassword) {
        showMessage("Contraseña actualizada con éxito.");
        onBack();
      } else {
        showMessage("Las contraseñas no coinciden. Inténtalo de nuevo.");
      }
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
