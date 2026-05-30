require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    console.log('🔄 Connecting to database...');
    
    // Read the migration file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', '001_init.sql'),
      'utf8'
    );
    
    console.log('📝 Running migration...');
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify tables were created
    console.log('\n📋 Verifying tables...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tables created:');
    result.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
    // Insert test data
    console.log('\n🧪 Inserting test data...');
    const testResult = await pool.query(`
      INSERT INTO applications (name, mobile, amount, purpose, language) 
      VALUES ('Test User', '9876543210', 50000, 'Business', 'Hindi') 
      RETURNING *
    `);
    
    console.log('✅ Test record created:');
    console.log(testResult.rows[0]);
    
    await pool.end();
    console.log('\n🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runMigration();
