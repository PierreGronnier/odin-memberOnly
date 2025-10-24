const { Client } = require("pg");
require("dotenv").config();

const SQL = `
-- Création de la table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  membership BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Création de la table des messages
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  likes INT DEFAULT 0,
  author_id INT REFERENCES users(id) ON DELETE CASCADE
);

`;

async function main() {
  console.log("🔧 Initialisation de la base de données 'Hot Takes'...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("✅ Tables créées ou déjà existantes !");
  } catch (err) {
    console.error("❌ Erreur lors de l'initialisation :", err.message);
    throw err;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  main();
}

module.exports = main;
