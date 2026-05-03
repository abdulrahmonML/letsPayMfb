const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.MAIL_HOST,
  /* port: 587 */ port: process.env.MAIL_PORT,
  /* secure: false  */ secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verify = async () => {
  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (err) {
    console.error("Verification failed:", err);
  }
};
verify();

module.exports = transporter;
