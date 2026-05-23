import { query } from '../db/pool.js';

export async function stats(req, res, next) {
  try {
    const result = await query(
      `SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE report_type = 'Lost')::int AS lost,
        COUNT(*) FILTER (WHERE report_type = 'Found')::int AS found,
        COUNT(*) FILTER (WHERE report_status = 'Active')::int AS active,
        COUNT(*) FILTER (WHERE report_status = 'Resolved')::int AS resolved,
        (SELECT COUNT(*)::int FROM claims WHERE status = 'Pending') AS pending_claims,
        COUNT(DISTINCT location)::int AS locations
       FROM items`
    );

    const recent = await query(
      `SELECT i.id, i.title, i.report_type, i.report_status, i.location, i.created_at
         FROM items i
        ORDER BY i.created_at DESC
        LIMIT 5`
    );

    res.json({ ok: true, stats: result.rows[0], recent: recent.rows });
  } catch (error) {
    next(error);
  }
}

export async function users(req, res, next) {
  try {
    const result = await query(
      `SELECT id, full_name, email, phone, role, created_at
         FROM users
        ORDER BY created_at DESC`
    );
    res.json({ ok: true, users: result.rows });
  } catch (error) {
    next(error);
  }
}
