import express from 'express';
import { stats, users } from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', requireAdmin, stats);
router.get('/users', requireAdmin, users);

export default router;
