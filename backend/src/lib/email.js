import sgMail from '@sendgrid/mail';

// Validate SendGrid configuration
if (!process.env.SENDGRID_API_KEY) {
  console.warn('WARNING: SENDGRID_API_KEY is not set');
}
if (!process.env.SENDGRID_FROM_EMAIL) {
  console.warn('WARNING: SENDGRID_FROM_EMAIL is not set');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendVerificationEmail(email, token, baseUrl) {
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Verify Your Streamify Email',
    html: `
      <h2>Verify Your Email Address</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending verification email:', error.message);
    throw error;
  }
}

export async function sendPasswordResetEmail(email, token, baseUrl) {
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Reset Your Streamify Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        
        <p style="color: #666; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="
            background-color: #6366f1;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
          ">
            Reset Password
          </a>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Or copy and paste this link in your browser:<br>
          <code style="background-color: #f5f5f5; padding: 10px; display: block; margin-top: 10px; word-break: break-all;">
            ${resetUrl}
          </code>
        </p>

        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This link will expire in 1 hour.
        </p>

        <p style="color: #d32f2f; font-size: 14px; margin-top: 20px;">
          <strong>Important:</strong> If you didn't request a password reset, please ignore this email and your password will remain unchanged.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="color: #999; font-size: 12px; text-align: center;">
          If you have any questions, please contact our support team.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    throw error;
  }
}
