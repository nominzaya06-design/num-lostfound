import { query } from '../db/pool.js';
import { ApiError, notFound } from '../utils/apiError.js';
import { validateItem, validateItemPatch } from '../validators/item.validator.js';
import { validationError } from '../middleware/validate.js';

function itemRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.report_type,
    reportStatus: row.report_status,
    category: row.category,
    location: row.location,
    image: row.image_url,
    date: row.created_at,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
    contactAction: row.report_type === 'Found' ? 'Claim' : 'Found it?',
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    postedBy: row.owner_email,
    postedByName: row.owner_name,
    ownerId: row.owner_id
  };
}

function sortClause(sort = 'newest') {
  switch (sort) {
    case 'oldest': return 'i.created_at ASC';
    case 'title_asc': return 'LOWER(i.title) ASC';
    case 'title_desc': return 'LOWER(i.title) DESC';
    default: return 'i.created_at DESC';
  }
}

export async function listItems(req, res, next) {
  try {
    const { status, reportStatus, category, location, q, sort } = req.query;
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 24), 1), 60);
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];

    if (status && status !== 'Lost & found') {
      params.push(status);
      where.push(`i.report_type = $${params.length}`);
    }

    if (reportStatus && reportStatus !== 'All') {
      params.push(reportStatus);
      where.push(`i.report_status = $${params.length}`);
    }

    if (category && !category.startsWith('All')) {
      params.push(category);
      where.push(`i.category = $${params.length}`);
    }

    if (location && !location.startsWith('All')) {
      params.push(location);
      where.push(`i.location = $${params.length}`);
    }

    if (q) {
      params.push(`%${q}%`);
      where.push(`(i.title ILIKE $${params.length} OR i.description ILIKE $${params.length} OR i.location ILIKE $${params.length})`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    params.push(limit, offset);

    const result = await query(
      `SELECT i.*, u.email AS owner_email, u.full_name AS owner_name
         FROM items i
         JOIN users u ON u.id = i.owner_id
         ${whereSql}
        ORDER BY ${sortClause(sort)}
        LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ ok: true, items: result.rows.map(itemRow), page, limit });
  } catch (error) {
    next(error);
  }
}

export async function getItem(req, res, next) {
  try {
    const result = await query(
      `SELECT i.*, u.email AS owner_email, u.full_name AS owner_name
         FROM items i
         JOIN users u ON u.id = i.owner_id
        WHERE i.id = $1`,
      [req.params.id]
    );

    if (!result.rows[0]) throw notFound('Item not found.');
    res.json({ ok: true, item: itemRow(result.rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function createItem(req, res, next) {
  try {
    const { data, errors } = validateItem(req.body);
    if (errors.length) throw validationError(errors);

    const result = await query(
      `INSERT INTO items
        (owner_id, title, description, report_type, report_status, category, location, image_url, contact_email, contact_phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        req.user.id,
        data.title,
        data.description,
        data.reportType,
        data.reportStatus,
        data.category,
        data.location,
        data.imageUrl,
        data.contactEmail,
        data.contactPhone
      ]
    );

    const joined = await query(
      `SELECT i.*, u.email AS owner_email, u.full_name AS owner_name
         FROM items i JOIN users u ON u.id = i.owner_id
        WHERE i.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json({ ok: true, item: itemRow(joined.rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function updateItem(req, res, next) {
  try {
    const { data, errors } = validateItemPatch(req.body);
    if (errors.length) throw validationError(errors);

    const existing = await query('SELECT * FROM items WHERE id = $1', [req.params.id]);
    const item = existing.rows[0];
    if (!item) throw notFound('Item not found.');

    if (req.user.role !== 'admin' && item.owner_id !== req.user.id) {
      throw new ApiError(403, 'You can update only your own report.');
    }

    const updates = [];
    const params = [];

    if (data.title !== undefined) {
      params.push(data.title);
      updates.push(`title = $${params.length}`);
    }
    if (data.description !== undefined) {
      params.push(data.description);
      updates.push(`description = $${params.length}`);
    }
    if (data.reportStatus !== undefined) {
      params.push(data.reportStatus);
      updates.push(`report_status = $${params.length}`);
      updates.push(`resolved_at = CASE WHEN $${params.length} = 'Resolved' THEN NOW() ELSE NULL END`);
    }

    if (!updates.length) return res.json({ ok: true });

    params.push(req.params.id);
    await query(
      `UPDATE items SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${params.length}`,
      params
    );

    return getItem(req, res, next);
  } catch (error) {
    next(error);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const existing = await query('SELECT * FROM items WHERE id = $1', [req.params.id]);
    const item = existing.rows[0];
    if (!item) throw notFound('Item not found.');

    if (req.user.role !== 'admin' && item.owner_id !== req.user.id) {
      throw new ApiError(403, 'You can delete only your own report.');
    }

    await query('DELETE FROM items WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
