require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying database connection and data...\n');
    
    // Check all applications
    const result = await pool.query(`
      SELECT id, name, mobile, amount, purpose, language, status, created_at 
      FROM applications 
      ORDER BY created_at DESC
    `);
    
    console.log(`📊 Total applications: ${result.rows.length}\n`);
    
    result.rows.forEach((app, index) => {
      console.log(`Application #${index + 1}:`);
      console.log(`  ID: ${app.id}`);
      console.log(`  Name: ${app.name}`);
      console.log(`  Mobile: ${app.mobile}`);
      console.log(`  Amount: ₹${app.amount}`);
      console.log(`  Purpose: ${app.purpose}`);
      console.log(`  Language: ${app.language}`);
      console.log(`  Status: ${app.status}`);
      console.log(`  Created: ${app.created_at}`);
      console.log('');
    });
    
    await pool.end();
    console.log('✅ Database verification complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyDatabase();
