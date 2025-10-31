const pool = require("../pool");

// Créer un nouveau message (inchangé)
async function createMessage(content, author_id) {
  await pool.query(
    `INSERT INTO messages (content, author_id, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())`,
    [content, author_id]
  );
}

// Récupérer tous les messages avec le prénom de l'auteur (modifié pour inclure user_liked)
async function getAllMessages(userId = null) {
  let query = `
    SELECT 
      m.id, 
      m.content, 
      m.likes, 
      m.created_at, 
      u.first_name, 
      u.membership
  `;

  // Si un utilisateur est connecté, on vérifie s'il a liké chaque message
  if (userId) {
    query += `,
      EXISTS(
        SELECT 1 FROM likes 
        WHERE user_id = $1 AND message_id = m.id
      ) as user_liked
    `;
  } else {
    query += `, false as user_liked`;
  }

  query += `
    FROM messages m
    JOIN users u ON m.author_id = u.id
    ORDER BY m.created_at DESC
  `;

  const params = userId ? [userId] : [];
  const result = await pool.query(query, params);
  return result.rows;
}

// Toggle like/unlike
async function toggleLike(userId, messageId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Vérifier si le like existe déjà
    const existingLike = await client.query(
      "SELECT 1 FROM likes WHERE user_id = $1 AND message_id = $2",
      [userId, messageId]
    );

    if (existingLike.rows.length > 0) {
      // Supprimer le like
      await client.query(
        "DELETE FROM likes WHERE user_id = $1 AND message_id = $2",
        [userId, messageId]
      );
      await client.query(
        "UPDATE messages SET likes = likes - 1 WHERE id = $1",
        [messageId]
      );
      await client.query("COMMIT");
      return { action: "unliked", likes: await getMessageLikes(messageId) };
    } else {
      // Ajouter le like
      await client.query(
        "INSERT INTO likes (user_id, message_id) VALUES ($1, $2)",
        [userId, messageId]
      );
      await client.query(
        "UPDATE messages SET likes = likes + 1 WHERE id = $1",
        [messageId]
      );
      await client.query("COMMIT");
      return { action: "liked", likes: await getMessageLikes(messageId) };
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Obtenir le nombre de likes d'un message
async function getMessageLikes(messageId) {
  const result = await pool.query("SELECT likes FROM messages WHERE id = $1", [
    messageId,
  ]);
  return result.rows[0]?.likes || 0;
}

module.exports = {
  createMessage,
  getAllMessages,
  toggleLike,
};
