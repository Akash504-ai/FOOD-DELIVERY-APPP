import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;

const sender = {
  name: "Fooding 🍔",
  email: "santraakash999@gmail.com",
};

const sendMail = async (toEmail, subject, htmlContent) => {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender,
      to: [{ email: toEmail }],
      subject,
      htmlContent,
    },
    {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
};

export const sendWelcomeMail = async (toEmail, name) => {
  await sendMail(
    toEmail,
    "🎉 Welcome to Fooding!",
    `
    <h2>Hey ${name}, 👋</h2>
    <p>Welcome to <b>Fooding</b> 🍕</p>
    <p>Order your favorite food anytime!</p>
    <br/>
    <p>Enjoy your journey 🚀</p>
    `
  );
};

export const sendOtpMail = async (toEmail, otp) => {
  await sendMail(
    toEmail,
    "🔐 OTP Verification",
    `
    <h2>Password Reset</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>Expires in 5 minutes ⏳</p>
    `
  );
};

export const sendResetSuccessMail = async (toEmail) => {
  await sendMail(
    toEmail,
    "✅ Password Updated",
    `
    <h2>Password Changed</h2>
    <p>Your password has been successfully updated.</p>
    <p>If this wasn't you, contact support immediately.</p>
    `
  );
};

export const sendDeliveryOtpMail = async (toEmail, otp) => {
  await sendMail(
    toEmail,
    "🚚 Delivery OTP",
    `
    <h2>Delivery Verification</h2>
    <p>Your delivery OTP is:</p>
    <h1>${otp}</h1>
    <p>Give this to delivery partner to receive your order.</p>
    `
  );
};

export const sendDeliverySuccessMail = async (toEmail) => {
  await sendMail(
    toEmail,
    "📦 Order Delivered!",
    `
    <h2>Your order has been delivered 🎉</h2>
    <p>Hope you enjoy your food 😋</p>
    <p>Thank you for choosing Fooding ❤️</p>
    `
  );
};