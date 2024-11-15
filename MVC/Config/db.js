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
      console.error('Erro ao criar tabela "usuarios":', err);
      return;
    }
    console.log('Tabela "usuarios" criada com sucesso!');
  });

  const criarPost = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content TEXT NOT NULL,
      user_id INT NOT NULL,
      image VARCHAR(255),
      FOREIGN KEY (user_id) REFERENCES usuarios(id)
    );
  `;
  connection.query(criarPost, (err, result) => {
    if (err) {
      console.error('Erro ao criar tabela "posts":', err);
      return;
    }
    console.log('Tabela "posts" criada com sucesso!');
  });
});

module.exports = connection;