const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOtp = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtp;
