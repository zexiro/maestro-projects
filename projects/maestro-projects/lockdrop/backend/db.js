const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost')
    ? false
    : { rejectUnauthorized: false }
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE TABLE IF NOT EXISTS drops (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token VARCHAR(32) UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
        freelancer_email VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        project_name VARCHAR(255) NOT NULL,
        amount_pence INTEGER NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'gbp',
        file_name VARCHAR(255) NOT NULL,
        file_data BYTEA NOT NULL,
        file_size INTEGER,
        file_mime VARCHAR(128),
        stripe_payment_link_id VARCHAR(255),
        stripe_payment_link_url TEXT,
        stripe_payment_intent_id VARCHAR(255),
        paid BOOLEAN NOT NULL DEFAULT false,
        paid_at TIMESTAMPTZ,
        downloaded_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Database initialised');
  } finally {
    client.release();
  }
}

module.exports = { pool, initDb };
