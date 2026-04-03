import express from 'express';
import * as ctrl from '../controllers/userController.js';
import auth from '../middleware/authenticate.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();

router.use(auth);

router.get('/profile', ctrl.getProfile);

router.put('/profile', ctrl.updateProfile);

router.put('/change-password', ctrl.changePassword);


router.use(roleGuard('admin')); 

router.get('/', ctrl.getAllUsers);

router.put('/:id/status', ctrl.toggleStatus);

router.put('/:id/role', ctrl.updateRole);

export default router;