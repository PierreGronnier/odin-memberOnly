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

// Donner le statut de membre
async function updateMembershipStatus(userId, isMember) {
  await pool.query("UPDATE users SET membership = $1 WHERE id = $2", [
    isMember,
    userId,
  ]);
}

// Savoir si un utilisateur est un membre
async function isUserMember(userId) {
  const result = await pool.query(
    "SELECT membership FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0]?.membership || false;
}

// Donner le statut d'admin
async function updateAdminStatus(userId, isAdmin) {
  await pool.query("UPDATE users SET is_admin = $1 WHERE id = $2", [
    isAdmin,
    userId,
  ]);
}

// Savoir si un utilisateur est admin
async function isUserAdmin(userId) {
  const result = await pool.query("SELECT is_admin FROM users WHERE id = $1", [
    userId,
  ]);
  return result.rows[0]?.is_admin || false;
}

module.exports = {
  isUserMember,
  isUserAdmin,
  findUserByEmail,
  findUserById,
  createUser,
  updateMembershipStatus,
  updateAdminStatus,
};
