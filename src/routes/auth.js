import { Router } from 'express';
import { registerStudent, registerTutor, login, me, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post("/register/student", registerStudent);
router.post("/register/tutor", registerTutor);
router.post("/login", login);
router.get("/me", protect, me);
router.post("/logout", logout);

export default router;