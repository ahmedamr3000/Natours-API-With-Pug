import { Router } from 'express';
import { getAllUsers, getOneUsers, updateUser } from './users.controller.js';
import { protect } from '../auth/auth.controller.js';

const router = Router();
router.use(protect);

router.get('/', getAllUsers);
router.get('/:id', getOneUsers);
router.put('/', protect, updateUser);

export default router;
