import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/db/pool.js';
import { hashPassword } from '../src/utils/password.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../..');

function toDbItem(item, ownerId) {
  return {
    ownerId,
    title: item.title,
    description: item.description,
    reportType: item.status,
    reportStatus: item.reportStatus || 'Active',
    category: item.category,
    location: item.location,
    imageUrl: item.image,
    contactEmail: item.contactEmail || 'lostfound@num.edu.mn',
    contactPhone: item.contactPhone || '+976 8800 1122',
    createdAt: item.date ? `${item.date}T09:00:00.000Z` : new Date().toISOString()
  };
}

try {
  await pool.query('BEGIN');

  const johnHash = hashPassword('demo1234');
  const adminHash = hashPassword('admin1234');

  const john = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    ['John Doe', 'john.doe@stud.num.edu.mn', johnHash, '+976 8800 1122', 'student']
  );

  await pool.query(
    `INSERT INTO users (full_name, email, password_hash, phone, role)
     VALUES ($1, $2, $3, $4, $5)`,
    ['Admin User', 'admin@num.edu.mn', adminHash, '+976 9900 7788', 'admin']
  );

  const jsonPath = path.join(projectRoot, 'data/items.json');
  const seedItems = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

  for (const item of seedItems.map(entry => toDbItem(entry, john.rows[0].id))) {
    await pool.query(
      `INSERT INTO items
        (owner_id, title, description, report_type, report_status, category, location, image_url, contact_email, contact_phone, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11)`,
      [
        item.ownerId,
        item.title,
        item.description,
        item.reportType,
        item.reportStatus,
        item.category,
        item.location,
        item.imageUrl,
        item.contactEmail,
        item.contactPhone,
        item.createdAt
      ]
    );
  }

  await pool.query('COMMIT');
  console.log('Seed data inserted.');
  console.log('Demo user: john.doe@stud.num.edu.mn / demo1234');
  console.log('Demo admin: admin@num.edu.mn / admin1234');
} catch (error) {
  await pool.query('ROLLBACK');
  console.error('Seeding failed.');
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
