import express from 'express';
import * as ctrl from '../controllers/recordController.js';
import auth from '../middleware/authenticate.js';
import roleGuard from '../middleware/roleGuard.js';
import validate from '../middleware/validate.js';
import { createRecordValidator, filterValidator, updateRecordValidator } from '../validators/recordValidators.js';

const router = express.Router();

router.use(auth);

router.get('/', filterValidator, validate, ctrl.getAll);             

router.post('/', roleGuard('analyst', 'admin'), createRecordValidator, validate, ctrl.create);

router.put('/:id', roleGuard('admin'), updateRecordValidator, validate, ctrl.update);


router.delete('/:id', roleGuard('admin'), ctrl.remove);

export default router;