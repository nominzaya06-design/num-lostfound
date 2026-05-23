import express from 'express';
import { createItem, deleteItem, getItem, listItems, updateItem } from '../controllers/items.controller.js';
import { createClaim, listItemClaims, updateClaim } from '../controllers/claims.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', listItems);
router.get('/:id', getItem);
router.post('/', requireAuth, createItem);
router.patch('/:id', requireAuth, updateItem);
router.delete('/:id', requireAuth, deleteItem);

router.get('/:itemId/claims', requireAuth, listItemClaims);
router.post('/:itemId/claims', requireAuth, createClaim);
router.patch('/:itemId/claims/:claimId', requireAuth, updateClaim);

export default router;
