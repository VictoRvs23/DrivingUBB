"use strict";
import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/configEnv.js";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendApprovalEmail = async (email, nombre, tempPassword) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (user && user.recibir_correos === false) {
      console.log(`El usuario ${email} tiene desactivadas las notificaciones. No se envió el correo de bienvenida.`);
      return;
    }

    const mailOptions = {
      from: `"Escuela de Manejo DrivingUBB" <${EMAIL_USER}>`,
      to: email,
      subject: "¡Felicidades! Tu solicitud ha sido aprobada",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #2c3e50;">Hola, ${nombre}</h2>
          <p>Nos complace informarte que tu solicitud para unirte a <strong>DrivingUBB</strong> ha sido aprobada.</p>
          <p>Puedes iniciar sesión en nuestra plataforma utilizando las siguientes credenciales:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Usuario:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Contraseña Temporal:</strong> <span style="color: #d9534f; font-weight: bold;">${tempPassword}</span></p>
          </div>
          <p>Te recomendamos cambiar tu contraseña una vez que ingreses por primera vez para mayor seguridad.</p>
          <p>¡Nos vemos en las clases!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8em; color: #777;">Este es un mensaje automático del sistema DrivingUBB, por favor no respondas a este correo.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`=> Correo de bienvenida enviado a: ${email}`);
  } catch (error) {
    console.error("=> Error al enviar el correo de bienvenida:", error);
  }
};

export const sendReservaConfirmationEmail = async (email, nombre, fecha, hora) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (user && user.recibir_correos === false) {
      console.log(`El usuario ${email} tiene desactivadas las notificaciones. No se envió el correo de reserva.`);
      return; 
    }

    const mailOptions = {
      from: `"Escuela de Manejo DrivingUBB" <${EMAIL_USER}>`,
      to: email,
      subject: "Confirmación de Clase Práctica - DrivingUBB 🚗",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #2c3e50;">¡Reserva Confirmada, ${nombre}!</h2>
          <p>Tu clase de conducción ha sido agendada exitosamente en nuestro sistema.</p>
          <div style="background-color: #eef7ff; padding: 20px; border-radius: 8px; border-left: 5px solid #3498db; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📅 Fecha:</strong> ${fecha}</p>
            <p style="margin: 5px 0;"><strong>⏰ Horario:</strong> ${hora} hrs.</p>
          </div>
          <p><strong>Recomendaciones importantes:</strong></p>
          <ul>
            <li>Llega al menos 5 minutos antes de la hora pactada.</li>
            <li>Lleva tu identificación (Cédula de Identidad).</li>
            <li>Si necesitas cancelar, por favor hazlo a través de la plataforma con anticipación.</li>
          </ul>
          <p>¡Mucho éxito en tu práctica!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8em; color: #777;">Atentamente,<br>Equipo de DrivingUBB</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`=> Correo de confirmación de reserva enviado a: ${email}`);
  } catch (error) {
    console.error("=> Error al enviar el correo de reserva:", error);
  }
};