import express from 'express';
import * as ctrl from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post('/register', registerValidator, validate, ctrl.register);

router.post('/verify-otp', ctrl.verifyOtp);

router.post('/login', loginValidator, validate, ctrl.login);

router.get('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

export default router;