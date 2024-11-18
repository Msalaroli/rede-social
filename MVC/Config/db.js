const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'aluno',
  password: 'aluno',
  database: 'node'
});

// Função para inicializar o banco de dados e criar as tabelas
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado com sucesso!');

    const criarUsuario = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL
      );
    `;
    await connection.query(criarUsuario);
    console.log('Tabela "usuarios" criada com sucesso!');

    const criarPost = `
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        user_id INT NOT NULL,
        image VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES usuarios(id)
      );
    `;
    await connection.query(criarPost);
    console.log('Tabela "posts" criada com sucesso!');

    connection.release(); // Libera a conexão de volta para o pool
  } catch (err) {
    console.error('Erro ao conectar com database: ', err);
  }
};

// Inicializa o banco de dados
initializeDatabase();

module.exports = pool;