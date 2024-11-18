const db = require('../Config/db');

exports.getAll = (callback) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    callback(err, results);
  });
};

exports.findByEmail = async (email) => {
  try {
    console.log('Buscando usuário pelo email:', email);
    const [result] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    console.log('Resultado da consulta:', result);
    return result[0]; // Retorna o primeiro usuário encontrado (ou undefined se não encontrar)
  } catch (error) {
    console.error('Erro ao buscar o usuário pelo email:', error);
    throw new Error('Erro ao buscar o usuário pelo email');
  }
};

exports.create = async (userData) => {
  try {
    const { name, email, password } = userData;
    console.log('Dados do usuário para criação:', { name, email, password });

    // Inserir o novo usuário no banco de dados
    const query = 'INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)';
    console.log('Consulta SQL:', query);
    const [result] = await db.query(query, [name, email, password]);
    console.log('Resultado da inserção:', result);

    // Retorna o usuário recém-criado com seu ID
    return { id: result.insertId, name, email };
  } catch (error) {
    console.error('Erro ao criar o usuário:', error);
    throw new Error('Erro ao criar o usuário');
  }
};