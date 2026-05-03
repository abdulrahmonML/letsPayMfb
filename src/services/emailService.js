const transporter = require("../email/mailer");
require("dotenv").config();

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: ` "userRegister" ${process.env.EMAIL_USER}`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully");
    console.log(info.response);

    return info;
  } catch (error) {
    console.error("Email sending Failed", error.message);
    throw error;
  }
};

module.exports = sendEmail;
