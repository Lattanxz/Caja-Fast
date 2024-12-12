import linkedin from "../../assets/imgs/linkedin.png";
import github from "../../assets/imgs/github.png";
import cajaReg from "../imgs/caja-registradora.png";
import mision from "../imgs/tarea.png";
import logo from "../imgs/logo_transparent cut.png";

export const titleItems = [
  { image: logo, label: "CAJA FAST", href: "App.tsx" },
];

export const barItems = [
  { label: "Cajas", href: "/boxes" },
  { label: "Usuarios", href: "/users" },
];

export const socialItems = [
  {
    image: linkedin,
    alt: "Linkedin",
    href: "https://www.linkedin.com/in/valentin-ezequiel-lattanzio/",
  },
  {
    image: github,
    alt: "Github",
    href: "https://github.com/Lattanxz?tab=overview&from=2024-11-01&to=2024-11-22",
  },
];

export const informationItems = [
  {
    image: cajaReg,
    text: "Sobre nosotros",
    description:
      "El objetivo de nuestro programa nace al observar que muchos puestos de feria utilizan métodos manuales, lo cual resulta lento, propenso a errores y consume tiempo valioso. Por esa razón, desarrollamos una solución digital que permite a cada negocio gestionar su caja de manera virtual, automatizando los cálculos y agilizando el proceso.",
  },
  {
    image: mision,
    text: "Nuestra misión",
    description:
      "Nuestra misión es mejorar la eficiencia y precisión en el cierre de caja, brindando a los stands una herramienta confiable que facilita la administración y ahorra tiempo. Trabajamos para que puedas concentrarte en lo que realmente importa: hacer eficiente tu negocio.",
  },
];

// src/assets/constants/index.tsx

export interface User {
  id_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
  password: string;
  rol_usuario: string;
}

export const infoUser: User[] = [
  {
    id_usuario: 1,
    nombre_usuario: "Valerio",
    email_usuario: "zxccxzzx",
    password: "contraseña",
    rol_usuario: "user",
  },
  {
    id_usuario: 2,
    nombre_usuario: "Armando",
    email_usuario: "xczcxzcxz",
    password: "contraseña",
    rol_usuario: "admin",
  },
  {
    id_usuario: 3,
    nombre_usuario: "Joderio",
    email_usuario: "zcxxcxz",
    password: "contraseña",
    rol_usuario: "user",
  },
  {
    id_usuario: 4,
    nombre_usuario: "Clamerio",
    email_usuario: "cxczc",
    password: "contraseña",
    rol_usuario: "user",
  },
  {
    id_usuario: 5,
    nombre_usuario: "Supuestio",
    email_usuario: "xdd",
    password: "contraseña",
    rol_usuario: "user",
  },
];
