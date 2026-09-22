const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_USER) {
    console.warn('⚠️  EMAIL_USER not set — skipping real send. Would have emailed:', { to, subject });
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;
