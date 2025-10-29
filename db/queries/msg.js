const pool = require("../pool");

// Savoir si un utilisateur est un membre
async function isUserMember(userId) {
  const result = await pool.query(
    "SELECT membership FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0]?.membership || false;
}

module.exports = {
  isUserMember,
};
