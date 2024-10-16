const express = require('express');
require('dotenv').config();
const mysql = require('mysql2');
const userRoutes = require('./MVC/routes/userRoutes');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//módulo de rotas
app.use(userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});