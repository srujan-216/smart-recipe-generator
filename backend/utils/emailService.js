const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@recipes.com',
      to,
      subject,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

const sendVerificationEmail = (email, token, baseURL) => {
  const verificationURL = `${baseURL}/api/auth/verify-email/${token}`;
  const htmlContent = `
    <h2>Welcome to Recipe Generator! 👋</h2>
    <p>Thank you for registering. Please verify your email address to get started.</p>
    <p><a href="${verificationURL}" style="background-color: #FF6B6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
    <p>Or copy and paste this link: ${verificationURL}</p>
    <p>This link expires in 24 hours.</p>
  `;
  return sendEmail(email, 'Verify Your Email - Recipe Generator', htmlContent);
};

const sendPasswordResetEmail = (email, token, baseURL) => {
  const resetURL = `${baseURL}/reset-password?token=${token}`;
  const htmlContent = `
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password. Click the button below to proceed.</p>
    <p><a href="${resetURL}" style="background-color: #FF6B6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
    <p>Or copy and paste this link: ${resetURL}</p>
    <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
  `;
  return sendEmail(email, 'Password Reset - Recipe Generator', htmlContent);
};

const sendWelcomeEmail = (userName, email) => {
  const htmlContent = `
    <h2>Welcome, ${userName}! 🍽️</h2>
    <p>Your account is ready to use. Start generating delicious Indian recipes with our AI-powered app.</p>
    <ul>
      <li>✨ Generate recipes from your favorite ingredients</li>
      <li>📋 Create shopping lists automatically</li>
      <li>📅 Plan your weekly meals</li>
      <li>💚 Save your favorite recipes</li>
      <li>📊 Track nutrition & costs</li>
    </ul>
    <p>Happy cooking! 👨‍🍳</p>
  `;
  return sendEmail(email, 'Welcome to Recipe Generator!', htmlContent);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
