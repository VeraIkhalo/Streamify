import express from 'express';
import { 
  signup, 
  login, 
  logout, 
  onboard,
  sendVerificationEmailHandler,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Email verification routes
router.post('/send-verification-email', sendVerificationEmailHandler);
router.post('/verify-email', verifyEmail);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/onboarding', protectRoute, onboard);
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;