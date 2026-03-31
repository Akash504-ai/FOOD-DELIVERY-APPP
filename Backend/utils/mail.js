import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sender = {
  name: "Fooding 🍔",
  email: "your_verified_email@brevo.com",
};

// ✅ Welcome Email
export const sendWelcomeMail = async (toEmail, name) => {
  const email = new Brevo.SendSmtpEmail();

  email.subject = "🎉 Welcome to Fooding!";
  email.htmlContent = `
    <h2>Hey ${name}, 👋</h2>
    <p>Welcome to <b>Fooding</b> 🍕</p>
    <p>Order your favorite food anytime!</p>
    <br/>
    <p>Enjoy your journey 🚀</p>
  `;
  email.sender = sender;
  email.to = [{ email: toEmail }];

  await apiInstance.sendTransacEmail(email);
};

// ✅ Auth OTP
export const sendOtpMail = async (toEmail, otp) => {
  const email = new Brevo.SendSmtpEmail();

  email.subject = "🔐 OTP Verification";
  email.htmlContent = `
    <h2>Password Reset</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>Expires in 5 minutes ⏳</p>
  `;
  email.sender = sender;
  email.to = [{ email: toEmail }];

  await apiInstance.sendTransacEmail(email);
};

// ✅ Password Reset Success
export const sendResetSuccessMail = async (toEmail) => {
  const email = new Brevo.SendSmtpEmail();

  email.subject = "✅ Password Updated";
  email.htmlContent = `
    <h2>Password Changed</h2>
    <p>Your password has been successfully updated.</p>
    <p>If this wasn't you, contact support immediately.</p>
  `;
  email.sender = sender;
  email.to = [{ email: toEmail }];

  await apiInstance.sendTransacEmail(email);
};

// ✅ Delivery OTP
export const sendDeliveryOtpMail = async (toEmail, otp) => {
  const email = new Brevo.SendSmtpEmail();

  email.subject = "🚚 Delivery OTP";
  email.htmlContent = `
    <h2>Delivery Verification</h2>
    <p>Your delivery OTP is:</p>
    <h1>${otp}</h1>
    <p>Give this to delivery partner to receive your order.</p>
  `;
  email.sender = sender;
  email.to = [{ email: toEmail }];

  await apiInstance.sendTransacEmail(email);
};

// ✅ Delivery Success
export const sendDeliverySuccessMail = async (toEmail) => {
  const email = new Brevo.SendSmtpEmail();

  email.subject = "📦 Order Delivered!";
  email.htmlContent = `
    <h2>Your order has been delivered 🎉</h2>
    <p>Hope you enjoy your food 😋</p>
    <p>Thank you for choosing Fooding ❤️</p>
  `;
  email.sender = sender;
  email.to = [{ email: toEmail }];

  await apiInstance.sendTransacEmail(email);
};