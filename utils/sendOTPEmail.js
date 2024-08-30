const nodemailer = require('nodemailer');

const sendOTPEmail = async (user, otp, type) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: type === 'register' ? 'Your Registration OTP' : 'Your Password Reset OTP',
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
