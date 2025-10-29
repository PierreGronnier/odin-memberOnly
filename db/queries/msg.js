const pool = require("../pool");

// Savoir si un utilisateur est un membre
async function isUserMember(userId) {
  const result = await pool.query(
    "SELECT membership FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0]?.membership || false;
}

// Créer un nouveau message
async function createMessage(content, author_id) {
  await pool.query(
    `INSERT INTO messages (content, author_id, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())`,
    [content, author_id]
  );
}

// Récupérer tous les messages avec le prénom de l'auteur
async function getAllMessages() {
  const result = await pool.query(`
      SELECT m.id, m.content, m.likes, m.created_at, u.first_name, u.membership
      FROM messages m
      JOIN users u ON m.author_id = u.id
      ORDER BY m.created_at DESC
    `);
  return result.rows;
}

module.exports = {
  isUserMember,
  createMessage,
  getAllMessages,
};
