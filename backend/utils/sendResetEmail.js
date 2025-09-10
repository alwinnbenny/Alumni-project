import nodemailer from "nodemailer";

const sendResetEmail = async (email, token) => {
  // const resetLink = `http://localhost:5173/reset-password/${token}`;
  const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;

  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};

export default sendResetEmail;
