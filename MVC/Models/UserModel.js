const db = require('../Config/db');

exports.getAll = (callback) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    callback(err, results);
  });
};

exports.findByEmail = async (email) => {
  try {
    const result = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return result[0]; // Retorna o primeiro usuário encontrado (ou undefined se não encontrar)
  } catch (error) {
    throw new Error('Erro ao buscar o usuário pelo email');
  }
};

exports.create = async (userData) => {
  try {
    const { name, email, password } = userData;

    // Inserir o novo usuário no banco de dados
    const result = await db.query('INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)', [name, email, password]);

    // Retorna o usuário recém-criado com seu ID
    return { id: result.insertId, name, email };
  } catch (error) {
    throw new Error('Erro ao criar o usuário');
  }
};