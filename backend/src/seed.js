const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seed() {
  try {
    const email = 'admin@vitto.com';
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 12);

    await pool.query(
      `INSERT INTO users (email, password, role)
       VALUES ($1, $2, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [email, hash]
    );

    console.log('Admin user seeded: admin@vitto.com / admin123');
  } catch (error) {
    console.error('Seed error:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed();
