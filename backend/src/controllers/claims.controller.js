import { query } from '../db/pool.js';
import { ApiError, notFound } from '../utils/apiError.js';
import { validateClaim, validateClaimStatus } from '../validators/claim.validator.js';
import { validationError } from '../middleware/validate.js';

function claimRow(row) {
  return {
    id: row.id,
    itemId: row.item_id,
    itemTitle: row.item_title,
    claimantId: row.claimant_id,
    claimantName: row.claimant_name,
    claimantEmail: row.claimant_email,
    message: row.message,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    status: row.status,
    createdAt: row.created_at
  };
}

export async function listItemClaims(req, res, next) {
  try {
    const item = await query('SELECT * FROM items WHERE id = $1', [req.params.itemId]);
    if (!item.rows[0]) throw notFound('Item not found.');

    if (req.user.role !== 'admin' && item.rows[0].owner_id !== req.user.id) {
      throw new ApiError(403, 'Only the owner or admin can view claims for this item.');
    }

    const result = await query(
      `SELECT c.*, i.title AS item_title, u.full_name AS claimant_name, u.email AS claimant_email
         FROM claims c
         JOIN items i ON i.id = c.item_id
         JOIN users u ON u.id = c.claimant_id
        WHERE c.item_id = $1
        ORDER BY c.created_at DESC`,
      [req.params.itemId]
    );

    res.json({ ok: true, claims: result.rows.map(claimRow) });
  } catch (error) {
    next(error);
  }
}

export async function createClaim(req, res, next) {
  try {
    const { data, errors } = validateClaim(req.body);
    if (errors.length) throw validationError(errors);

    const item = await query('SELECT * FROM items WHERE id = $1', [req.params.itemId]);
    if (!item.rows[0]) throw notFound('Item not found.');
    if (item.rows[0].owner_id === req.user.id) throw new ApiError(400, 'You cannot claim your own report.');

    const result = await query(
      `INSERT INTO claims (item_id, claimant_id, message, contact_email, contact_phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.params.itemId, req.user.id, data.message, data.contactEmail, data.contactPhone]
    );

    res.status(201).json({ ok: true, claim: claimRow(result.rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function updateClaim(req, res, next) {
  try {
    const { data, errors } = validateClaimStatus(req.body);
    if (errors.length) throw validationError(errors);

    const result = await query(
      `SELECT c.*, i.owner_id
         FROM claims c
         JOIN items i ON i.id = c.item_id
        WHERE c.id = $1 AND c.item_id = $2`,
      [req.params.claimId, req.params.itemId]
    );

    const claim = result.rows[0];
    if (!claim) throw notFound('Claim not found.');

    if (req.user.role !== 'admin' && claim.owner_id !== req.user.id) {
      throw new ApiError(403, 'Only the owner or admin can update this claim.');
    }

    const updated = await query(
      `UPDATE claims SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *`,
      [data.status, req.params.claimId]
    );

    if (data.status === 'Accepted') {
      await query(
        `UPDATE items
            SET report_status = 'Resolved', resolved_at = NOW(), updated_at = NOW()
          WHERE id = $1`,
        [req.params.itemId]
      );
    }

    res.json({ ok: true, claim: claimRow(updated.rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function myClaims(req, res, next) {
  try {
    const result = await query(
      `SELECT c.*, i.title AS item_title, u.full_name AS claimant_name, u.email AS claimant_email
         FROM claims c
         JOIN items i ON i.id = c.item_id
         JOIN users u ON u.id = c.claimant_id
        WHERE c.claimant_id = $1 OR i.owner_id = $1
        ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    res.json({ ok: true, claims: result.rows.map(claimRow) });
  } catch (error) {
    next(error);
  }
}
