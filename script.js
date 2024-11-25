const express = require('express');
require('dotenv').config();
const mysql = require('mysql2');
const userRoutes = require('./MVC/routes/userRoutes');
const path = require('path');
const authMiddleware = require('./MVC/middleware/authMiddleware');
const cookieParser = require('cookie-parser'); 

const app = express();

// Configurar o EJS como mecanismo de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'MVC', 'view'));

// Middleware para analisar cookies
app.use(cookieParser());

// Middleware para analisar JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Adicionar middleware para logar requisições
app.use((req, res, next) => {
  console.log(`Método: ${req.method}, URL: ${req.url}, Body:`, req.body);
  next();
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Módulo de rotas
app.use(userRoutes);

// Middleware para verificar o token JWT
app.use(authMiddleware.verifyToken);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});