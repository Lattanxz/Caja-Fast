import { Fragment } from "react";
import { Transition } from "@headlessui/react";

interface NotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const Notification = ({ show, message, onClose }: NotificationProps) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Transition
        as={Fragment}
        show={show}
        enter="transition ease-out duration-300 transform"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200 transform"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div className="p-4 bg-orange-500 text-white rounded-lg shadow-lg">
          <p>{message}</p>
          <button
            onClick={onClose}
            className="text-sm mt-2 underline hover:text-orange-300"
          >
            Cerrar
          </button>
        </div>
      </Transition>
    </div>
  );
};

export default Notification;
