# Email Configuration Setup

To enable email verification and password reset functionality, you need to configure Gmail SMTP credentials.

## Steps to Setup Gmail App Password:

1. **Enable 2-Factor Authentication on your Google Account**
   - Go to myaccount.google.com
   - Select "Security" from the left menu
   - Enable "2-Step Verification"

2. **Generate Gmail App Password**
   - Go to myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this password

3. **Update Your .env File**

Add these lines to your `.env` file:

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password-here
CLIENT_URL=http://localhost:5173
```

Replace:
- `your-gmail@gmail.com` - Your actual Gmail address
- `your-app-password-here` - The 16-character app password from step 2

## Alternative: Using Other Email Services

If you prefer to use another email service (SendGrid, Mailgun, etc.), you'll need to modify the `/src/lib/email.js` file to use that service's configuration.

## Testing Email Functionality

Once configured, test by:
1. Creating a new account (verification email will be sent)
2. Using "Forgot Password" (password reset email will be sent)

## Email Endpoints

### Send Verification Email
```
POST /api/auth/send-verification-email
Body: { "email": "user@example.com" }
```

### Verify Email
```
POST /api/auth/verify-email
Body: { "token": "verification-token-from-email" }
```

### Request Password Reset
```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
```

### Reset Password
```
POST /api/auth/reset-password
Body: { 
  "token": "reset-token-from-email",
  "newPassword": "new-password",
  "confirmPassword": "new-password"
}
```

## Notes

- Verification tokens expire after 24 hours
- Password reset tokens expire after 1 hour
- Install nodemailer if not already installed: `npm install nodemailer`
