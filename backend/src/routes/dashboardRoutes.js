import express from 'express';
import * as ctrl from '../controllers/dashboardController.js';
import auth from '../middleware/authenticate.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();

router.use(auth, roleGuard('analyst', 'admin'));



router.get('/summary',         ctrl.summary);
router.get('/category-totals', ctrl.categoryTotals);
router.get('/monthly-trends',  ctrl.monthlyTrends);
router.get('/recent-activity', ctrl.recentActivity);

export default router;