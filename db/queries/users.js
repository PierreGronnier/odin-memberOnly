const pool = require("../pool");

// Récupérer un utilisateur par email
async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

// Récupérer un utilisateur par ID
async function findUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

// Créer un nouvel utilisateur
async function createUser(first_name, last_name, email, password_hash) {
  await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash)
     VALUES ($1, $2, $3, $4)`,
    [first_name, last_name, email, password_hash]
  );
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
