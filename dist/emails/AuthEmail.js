"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'Uptask <admin@uptask.com',
            to: user.email,
            subject: 'Uptask - confirma tu cuenta',
            text: 'Uptask- confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en Uptask, ya casi esta todo listo, solo tienes que confirmar tu cuenta</p>
                        <p>Visita el siguiente enlace:</p>
                        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
                        <p> E ingresa el codigo: <b>${user.token}</b></p>
                        <p> este token expira en 10 minutos </p>            
            `
        });
        console.log('Mensaje Enviado', info.messageId);
    };
    static sendPasswordResetToken = async (user) => {
        const info = await nodemailer_1.transporter.sendMail({
            from: 'Uptask <admin@uptask.com',
            to: user.email,
            subject: 'Uptask - Reestablece tu password',
            text: 'Uptask - Reestablece tu password',
            html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
                         <p>Visita el siguiente enlace: </p>
                         <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer password</a>
                         <p> E ingresa el codigo: <b>${user.token}</b></p>
                         <p> este token expira en 10 minutos </p>            
             `
        });
        console.log('Mensaje Enviado', info.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map