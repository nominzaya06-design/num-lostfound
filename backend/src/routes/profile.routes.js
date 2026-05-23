import express from 'express';
import { myClaims } from '../controllers/claims.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/claims', requireAuth, myClaims);

export default router;
