# Email Authentication Implementation Guide

## Overview
I've implemented **Email Verification** and **Forgot Password/Password Reset** functionality for your Streamify app.

## 🔧 Setup Instructions

### 1. Install Dependencies
First, install nodemailer in your backend:
```bash
cd backend
npm install nodemailer
```

### 2. Configure Email Service
Add the following to your `.env` file:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password-here
CLIENT_URL=http://localhost:5173
```

**To get Gmail App Password:**
1. Go to myaccount.google.com
2. Click "Security" in the left menu
3. Enable "2-Step Verification"
4. Go to myaccount.google.com/apppasswords
5. Select "Mail" and "Windows Computer"
6. Google generates a 16-character password
7. Copy this password to `EMAIL_PASSWORD` in `.env`

## 📋 Features Implemented

### Backend Changes

#### 1. **User Model Updates** (`src/models/User.js`)
Added fields for email verification and password reset:
- `isEmailVerified` - Boolean flag
- `emailVerificationToken` - Token hash
- `emailVerificationExpire` - Token expiration
- `passwordResetToken` - Token hash
- `passwordResetExpire` - Token expiration

Methods added:
- `generateEmailVerificationToken()` - Generates 24-hour token
- `generatePasswordResetToken()` - Generates 1-hour token

#### 2. **Email Service** (`src/lib/email.js`)
- `sendVerificationEmail()` - Sends verification email with link
- `sendPasswordResetEmail()` - Sends password reset email with link

#### 3. **Auth Controller Updates** (`src/controllers/auth.controller.js`)
New functions:
- `sendVerificationEmailHandler()` - Resend verification email
- `verifyEmail()` - Verify email with token
- `forgotPassword()` - Request password reset
- `resetPassword()` - Reset password with token

#### 4. **Auth Routes Updates** (`src/routes/auth.route.js`)
New endpoints:
```
POST /api/auth/send-verification-email
POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Frontend Changes

#### 1. **New Pages**
- **VerifyEmailPage** (`src/pages/VerifyEmailPage.jsx`)
  - Route: `/verify-email?token=...`
  - Automatically verifies email when token is valid
  
- **ForgotPasswordPage** (`src/pages/ForgotPasswordPage.jsx`)
  - Route: `/forgot-password`
  - Form to request password reset email
  
- **ResetPasswordPage** (`src/pages/ResetPasswordPage.jsx`)
  - Route: `/reset-password?token=...`
  - Form to reset password with token
  
- **ResendVerificationPage** (`src/pages/ResendVerificationPage.jsx`)
  - Route: `/resend-verification`
  - Resend verification email if original expired

#### 2. **Updated LoginPage**
- Added "Forgot password?" link below password field
- Links to `/forgot-password`

#### 3. **Updated App.jsx**
- Added routes for all new pages

## 🔐 Workflow

### Email Verification Flow
1. User signs up
2. Account created but `isEmailVerified = false`
3. Verification email sent automatically
4. User clicks link in email → redirected to `/verify-email?token=...`
5. Page verifies token and marks email as verified
6. User can now use all features

### Forgot Password Flow
1. User clicks "Forgot password?" on login page
2. User enters email → verification email sent
3. User clicks link in email → redirected to `/reset-password?token=...`
4. User enters new password
5. Password updated, token cleared
6. User can login with new password

## 📧 Email Customization

Edit email templates in `src/lib/email.js`:
- Customize HTML layout
- Change colors and styling
- Update link text

## 🔒 Security Features

- ✅ Tokens are hashed before storage (SHA-256)
- ✅ Tokens expire automatically (24h verification, 1h reset)
- ✅ Passwords hashed with bcrypt
- ✅ Tokens are one-time use
- ✅ Email validation on all endpoints

## 📱 Current Flow in App

### Signup
1. User signs up with email/password
2. Account created with `isEmailVerified: false`
3. Verification email sent
4. User verifies email to enable full access

### Login
1. User can login even before email verification (optional - can restrict if needed)
2. "Forgot password?" link available
3. Password reset email sent
4. User resets password and logs in

## 🚀 Optional Enhancements

You can optionally make email verification required before login:

In `src/controllers/auth.controller.js`, in the `login` function, add:
```javascript
if (!user.isEmailVerified) {
  return res.status(403).json({ 
    message: "Please verify your email first" 
  });
}
```

## 📝 Testing

1. **Local Development:**
   - Use Gmail app password
   - Check console for email logs
   - Check spam folder for test emails

2. **Testing Endpoints:**
```bash
# Send verification email
curl -X POST http://localhost:5001/api/auth/send-verification-email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Forgot password
curl -X POST http://localhost:5001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

## 🐛 Troubleshooting

**Emails not sending?**
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify 2-factor auth is enabled on Gmail
- Check "Less secure app access" if using regular password
- Check spam folder

**Token invalid/expired?**
- Verification tokens: 24 hours
- Reset tokens: 1 hour
- User can resend verification or forgot password again

**Database issues?**
- Run migration if needed
- Check MongoDB connection
- Verify schema matches User model

## 📚 Files Modified/Created

### Backend
- ✨ Created: `src/lib/email.js`
- ✨ Created: `EMAIL_SETUP.md`
- ✏️ Modified: `src/models/User.js`
- ✏️ Modified: `src/controllers/auth.controller.js`
- ✏️ Modified: `src/routes/auth.route.js`

### Frontend
- ✨ Created: `src/pages/VerifyEmailPage.jsx`
- ✨ Created: `src/pages/ForgotPasswordPage.jsx`
- ✨ Created: `src/pages/ResetPasswordPage.jsx`
- ✨ Created: `src/pages/ResendVerificationPage.jsx`
- ✏️ Modified: `src/pages/LoginPage.jsx`
- ✏️ Modified: `src/App.jsx`

## ✅ Next Steps

1. Install nodemailer: `npm install nodemailer`
2. Add EMAIL credentials to `.env`
3. Test signup flow
4. Test forgot password flow
5. Customize email templates as needed
6. Deploy with email service in production

---

**Note:** Remember to use environment variables for sensitive credentials and never commit `.env` files to git!
