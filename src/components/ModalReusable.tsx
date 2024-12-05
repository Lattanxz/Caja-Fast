import React from "react";
import Modal from "react-modal";
import { X } from "lucide-react";

Modal.setAppElement("#root");

interface ModalReusableProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const ModalReusable: React.FC<ModalReusableProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      className="bg-orange-400 w-[600px] rounded-lg shadow-lg p-6 relative "
    >
      <div className="bg-black text-white rounded-xl">
        {/* Botón de cierre */}
        <button
          className="absolute top-1 right-1 text-black hover:text-gray-700"
          onClick={onClose}
        >
          <X />
        </button>
        <div className="space-y-4 p-4">
          {/* Título opcional */}
          {title && (
            <h2 className="text-xl font-normal mb-4 text-center">{title}</h2>
          )}
          {/* Contenido dinámico */}
          <div>{children}</div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalReusable;
