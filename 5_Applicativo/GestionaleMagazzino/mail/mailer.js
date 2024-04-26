const nodemailer = require("nodemailer");

/**
 * Configurazione del server SMTP per l'invio delle email
 * (!! non funziona tramite proxy !!)
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});


/**
 * Funzione per inviare una email dall'indirizzo "gestionale-magazzino@ik.me"
 * @param receiverAddr indirizzo email del destinatario
 * @param subject oggetto della mail
 * @param text corpo della email
 * @returns risposta del server SMTP
 */
async function sendMail(receiverAddr, subject, text){
  try{
    const message = await transporter.sendMail({
      from: '"Gestionale Magazzino" <gestionale-magazzino@ik.me>',
      to: receiverAddr,
      subject: subject,
      html: text
    });
    return message.response;
  }catch(ex){
    return ex.message
  }
}

module.exports = {sendMail}