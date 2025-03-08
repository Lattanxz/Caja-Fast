const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Puedes usar otro servicio de correo
  auth: {
    user: process.env.EMAIL_USER, // Configura tu email en variables de entorno
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;
