import express from 'express';
import { ssoLogin, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/sso-login', ssoLogin);
router.post('/logout', logout);

export default router;