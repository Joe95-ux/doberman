// jshint esversion:6
require("dotenv").config();
const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");

//create transporter

async function sendMail(email, subject, fname, lname, phone, state, text) {
  let smtpTransport = await nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      type: "login",
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS
    }
  });

  let mailOptions = {
    from: email,
    to: "info@everlandpuppies.com",
    subject: subject,
    html: `You got a message from
    Email: email
    name: ${fname} ${lname}
    phone: ${phone}
    state: ${state}
    message: ${text}
    `
  };
  try {
    await smtpTransport.sendMail(mailOptions);
    return Promise.resolve("Message sent successfully")
  } catch (err) {
    return Promise.reject(err)
  }
}

module.exports = sendMail;
