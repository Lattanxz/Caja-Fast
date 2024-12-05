import { Menu, MenuItem, MenuDivider, MenuGroup } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { User, Edit3, HelpCircle, LogOut } from "lucide-react";
import ProfileButton from "./ProfileButton";

const ProfileMenu = () => {
  return (
    <Menu
      menuButton={
        <button className="flex items-center bg-black p-2 rounded-full cursor-pointer">
          <User className="text-white w-5 h-5" />
        </button>
      }
      direction="bottom"
      align="end"
      menuClassName="w-60 rounded-lg shadow-lg border"
    >
      {/* Foto y detalles del usuario */}
      <div className="p-4 flex flex-col items-center">
        <img
          src="https://via.placeholder.com/60"
          alt="Foto de perfil"
          className="w-16 h-16 rounded-full mb-2"
        />
        <h3 className="text-lg font-semibold">Nombre del Usuario</h3>
        <p className="text-sm ">Rol o descripción</p>
      </div>
      <MenuDivider />
      {/* Opciones del menú */}
      <MenuGroup className={"text-black"}>
        <ProfileButton>
          <MenuItem className={"hover:bg-gray-500 "}>
            <User className="w-5 h-5 mr-2 " />
            Mi Perfil
          </MenuItem>
          <MenuItem className={"hover:bg-gray-500 "}>
            <Edit3 className="w-5 h-5 mr-2 " />
            Editar Perfil
          </MenuItem>
        </ProfileButton>
        <MenuItem className={"hover:bg-gray-500"}>
          <HelpCircle className="w-5 h-5 mr-2 " />
          Ayuda
        </MenuItem>
        <MenuDivider />
        <MenuItem className={"hover:bg-gray-500 "}>
          <LogOut className="w-5 h-5 mr-2 " />
          Cerrar Sesión
        </MenuItem>
      </MenuGroup>
    </Menu>
  );
};

export default ProfileMenu;
