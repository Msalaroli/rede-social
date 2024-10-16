const db = require('../Config/db');

// Função para criar uma nova postagem
exports.createPost = async (content, image) => {
  try {
    const result = await db.query('INSERT INTO posts (content, image) VALUES (?, ?)', [content, image]);
    return { id: result.insertId, content, image }; // Retorna o ID da postagem recém-criada
  } catch (error) {
    throw new Error('Erro ao criar uma nova postagem');
  }
};

// Função para deletar uma postagem
exports.deletePost = async (postId) => {
  try {
    await db.query('DELETE FROM posts WHERE id = ?', [postId]);
  } catch (error) {
    throw new Error('Erro ao deletar a postagem');
  }
};
