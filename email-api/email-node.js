import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: 'lucreciaua@meta.ua',
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);



const sendEmail = (data) => {
  const email = { ...data, from: 'lucreciaua@meta.ua' };
  return transporter.sendMail(email);
};

export default sendEmail;
