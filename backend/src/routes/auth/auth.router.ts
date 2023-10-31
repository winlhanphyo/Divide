import express from "express";

import { authController } from "../../controllers/auth/auth.controller";

const router =express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forget-password', authController.forgetPassword);
router.post('/password-reset-update/:userId/:token', authController.resetPassword);

export default router;
