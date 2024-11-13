const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'aluno',
  password: 'aluno',
  database: 'node'
});
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com database: ', err);
    return;
  }
  console.log('Conectado com sucesso!');

  const criarUsuario = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      senha VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL
    );
  `;
  connection.query(criarUsuario, (err, result) => {
    if (err) {
      console.error('Erro ao criar tabela:', err);
      return;
    }
    console.log('Tabela "usuarios" criada com sucesso!');
  });

  const criarPost = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content TEXT NOT NULL,
      image VARCHAR(255)
    );
  `;
  connection.query(criarPost, (err, result) => {
    if (err) {
      console.error('Erro ao criar tabela:', err);
      return;
    }
    console.log('Tabela "posts" criada com sucesso!');
  });

  const criarUserPosts = `
    CREATE TABLE IF NOT EXISTS user_posts (
      user_id INT NOT NULL,
      post_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES usuarios(id),
      FOREIGN KEY (post_id) REFERENCES posts(id)
    );
  `;
  connection.query(criarUserPosts, (err, result) => {
    if (err) {
      console.error('Erro ao criar tabela:', err);
      return;
    }
    console.log('Tabela "user_posts" criada com sucesso!');
  });
});

module.exports = connection;