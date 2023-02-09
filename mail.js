// jshint esversion:6
require("dotenv").config();
const nodemail = require("nodemailer");

//create transporter

async function mainMail(email, subject, fname, lname, phone, state, text) {
  const smtpTransport = nodemail.createTransport({
    service:'Zoho',
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      type:'login',
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS
    }
  });
  let mailOption = {
    to: process.env.ZOHO_USER,
    from: process.env.ZOHO_INFO,
    subject: subject,
    html: `You got a message from
    Email: ${email}
    name: ${fname}
    puppy: ${lname}
    phone: ${phone}
    state: ${state}
    message: ${text}
    `
  };
  try {
    await smtpTransport.sendMail(mailOption);
    return Promise.resolve("Message sent successfully")
  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}

module.exports = mainMail;
