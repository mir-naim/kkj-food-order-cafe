//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Email process
//Descrption: Processing email process for reset password
//First written on: 30 May, 2026
//Edited on:


const nodemailer = require('nodemailer');

const sendEmail = async options =>{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });

      const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
      }

      await transporter.sendMail(message)
}

module.exports = sendEmail;