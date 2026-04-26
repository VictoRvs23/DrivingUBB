"use strict";
import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/configEnv.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendApprovalEmail = async (email, nombre, tempPassword) => {
  const mailOptions = {
    from: `"Escuela de Manejo DrivingUBB" <${EMAIL_USER}>`,
    to: email,
    subject: "¡Felicidades! Tu solicitud ha sido aprobada",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hola, ${nombre}</h2>
        <p>Nos complace informarte que tu solicitud para unirte a <strong>DrivingUBB</strong> ha sido aprobada.</p>
        <p>Puedes iniciar sesión en nuestra plataforma utilizando las siguientes credenciales:</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
          <p><strong>Usuario:</strong> ${email}</p>
          <p><strong>Contraseña Temporal:</strong> <span style="color: #d9534f; font-weight: bold;">${tempPassword}</span></p>
        </div>
        <p style="margin-top: 20px;">Te recomendamos cambiar tu contraseña una vez que ingreses por primera vez.</p>
        <p>¡Nos vemos en las clases!</p>
        <hr />
        <p style="font-size: 0.8em; color: #777;">Este es un mensaje automático, por favor no respondas a este correo.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`=> Correo de bienvenida enviado a: ${email}`);
  } catch (error) {
    console.error("=> Error al enviar el correo:", error);
  }
};
