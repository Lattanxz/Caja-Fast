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
  { label: "Soporte", href: "#" },
  { label: "Terminos y Condiciones", href: "#" },
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

export const infoUser = [
  { id: 1, name: "Valerio", email: "zxccxzzx", role: "user" },
  { id: 2, name: "Armando", email: "xczcxzcxz", role: "admin" },
  { id: 3, name: "Joderio", email: "zcxxcxz", role: "user" },
  { id: 4, name: "Clamerio", email: "cxczc", role: "user" },
  { id: 5, name: "Supuestio", email: "xdd", role: "user" },
];
