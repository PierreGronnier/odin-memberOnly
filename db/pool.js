const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ ERREUR CONNEXION DB:", err.message);
    console.error("🔍 Détails:", err);
    console.log(
      "📡 URL utilisée:",
      process.env.DATABASE_URL ? "présente" : "absente"
    );
  } else {
    console.log("✅ CONNECTÉ À POSTGRESQL AVEC SUCCÈS!");
    console.log("🏠 Host:", client.connectionParameters.host);
    release();
  }
});

pool.on("error", (err, client) => {
  console.error("💥 ERREUR POOL POSTGRESQL:", err);
});

pool.on("connect", () => {
  console.log("🔗 Nouvelle connexion DB établie");
});

module.exports = pool;
