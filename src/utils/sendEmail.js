import nodemailer from "nodemailer";

export default function sendEmail({ to, subject, text }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter
    .sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    })
    .catch((err) => console.error("Email sending failed:", err.message));
}
