const db = require('../Config/db');

exports.getAll = (callback) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    callback(err, results);
  });
};

exports.findByEmail = async (email) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return result[0]; // Retorna o primeiro usuário encontrado (ou undefined se não encontrar)
  } catch (error) {
    throw new Error('Erro ao buscar o usuário pelo email');
  }
};

exports.create = async (userData) => {
  try {
    const { name, email, password } = userData;

    // Inserir o novo usuário no banco de dados
    const result = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);

    // Retorna o usuário recém-criado com seu ID
    return { id: result.insertId, name, email };
  } catch (error) {
    throw new Error('Erro ao criar um novo usuário');
  }
};

exports.findById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return result[0]; // Retorna o usuário encontrado
  } catch (error) {
    throw new Error('Erro ao buscar o usuário pelo ID');
  }
};

exports.addPostToUser = async (userId, postId) => {
  try {
    await db.query('INSERT INTO user_posts (user_id, post_id) VALUES (?, ?)', [userId, postId]);
  } catch (error) {
    throw new Error('Erro ao adicionar a postagem ao usuário');
  }
};

exports.isPostOwner = async (userId, postId) => {
  try {
    const result = await db.query('SELECT * FROM user_posts WHERE user_id = ? AND post_id = ?', [userId, postId]);
    return result.length > 0; // Retorna verdadeiro se o post pertence ao usuário
  } catch (error) {
    throw new Error('Erro ao verificar a propriedade da postagem');
  }
};