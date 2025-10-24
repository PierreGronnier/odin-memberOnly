const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL");
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err.message);
  });

pool.on("error", (err, client) => {
  console.error("Database error:", err);
});

module.exports = pool;
