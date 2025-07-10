import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

// console.log(process.env.GMAIL_USER)
// console.log(process.env.GMAIL_PASSWORD)
const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_PASSWORD;


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS instead of SSL
  auth: {
    user,
    pass
  }
});


export const sendMail = async (email, token, tokenId) => {
    try {
        const frontendUri = process.env.FRONTEND_URI || "http://localhost:5173";
        const resetLink = `${frontendUri}/reset/${Buffer.from(`${email}:${token}:${tokenId}`).toString('base64')}`;

        const info = await transporter.sendMail({
            from: '"Workplace Repository" <no-reply@example.com>',
            to: email,
            subject: "Reset Password Request",
            html: getMailTemplate(resetLink)
        });

        console.log("Reset email sent:", info.messageId);
    } catch (err) {
        console.error("Failed to send email:", err);
        throw err;
    }
};

const getMailTemplate = (resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
  <style>
    body { font-family: Arial; background: #f4f4f4; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 40px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .button { background: #4a90e2; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
    .footer { margin-top: 40px; font-size: 12px; color: #777; text-align: center; }
  </style>
</head>
<body>
  <div class="email-container">
    <h2>Password Reset Request</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password. Click the button below:</p>
    <a href="${resetLink}" class="button">Reset Your Password</a>
    <p>If the link doesn't work, copy and paste this into your browser: <br><a href="${resetLink}">${resetLink}</a></p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>This link will expire in 1 hour.</p>
    <div class="footer">© 2025 Your Company. All rights reserved.</div>
  </div>
</body>
</html>
`;
