// jshint esversion:6
require("dotenv").config();
const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");

const auth = {
  auth: {
    api_key: process.env.API_KEY,
    domain: process.env.DOMAIN
  }
};

//create transporter

let smtpTransport = nodemailer.createTransport({
  pool: true,
  host: "smtp.zoho.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    type: "login",
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASS
  }
});

const sendMail = (email, subject, text, cb) => {
  let mailOptions = {
    to: "saintbenardpuppies@gmail.com",
    from: email,
    subject: subject,
    text:text
  };

  smtpTransport.sendMail(mailOptions, (err, data) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);
    }
  });
};

module.exports = sendMail;
