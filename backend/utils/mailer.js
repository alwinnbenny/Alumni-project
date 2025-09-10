// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// import { convert } from 'html-to-text';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendEmail = async (to, subject, html) => {
//   const text = convert(html, {
//     wordwrap: 130
//   });

//   const mailOptions = {
//     from: "Alumni CEP" ,
//     to,
//     subject,
//     text,
//     html,
//   };

//   await transporter.sendMail(mailOptions);
// };

// export default sendEmail;
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { convert } from 'html-to-text';

dotenv.config(); // load .env file



const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  const text = convert(html, { wordwrap: 130 });

  const mailOptions = {
    from: `"Alumni CEP" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
