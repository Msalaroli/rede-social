const express = require('express');
const UserController = require('../Controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const PostController = require('../Controllers/PostController');
const path = require('path');
const db = require('../Config/db');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const router = express.Router();

// Configuração do multer para armazenar arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Rotas públicas
router.get('/register', (req, res) => {
  res.render('register', { title: 'Registrar' });
});

router.post('/register', UserController.registerUser);

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', UserController.loginUser);

// Rotas protegidas
router.get('/posts', authMiddleware.verifyToken, (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao buscar posts');
    }
    res.render('posts', { title: 'Listar Posts', posts: results });
  });
});

router.get('/addPost', authMiddleware.verifyToken, (req, res) => {
  res.render('addPost', { title: 'Adicionar Post', user: req.user });
  console.log('user:', req.user);
});

router.post('/post', authMiddleware.verifyToken, upload.single('image'), PostController.addPost);

router.get('/profile', authMiddleware.verifyToken, async (req, res) => {
  try{
  console.log('rota profile acessada');
  console.log('req.user:', req.user.id);
  const userId = req.user.id;
  console.log('userId:', userId);
  const [results] = await db.query('SELECT * FROM posts WHERE user_id = ?', [userId]);
  res.render('user', { title: 'Perfil', user: req.user, posts: results });
} catch (err){
    console.error('Erro ao buscar posts:', err);
    return res.status(500).send('Erro ao buscar posts');
  }
  ;
});

router.post('/profile', authMiddleware.verifyToken, upload.single('image'), async (req, res) => {
    try{
        const { content } = req.body;
        const userId = req.user.id;
        const image = req.file ? req.file.filename : null;
        console.log('Dados recebidos:', { content, userId, image });
        const query = 'INSERT INTO posts (content, user_id, image) VALUES (?, ?, ?)';
        console.log('Consulta SQL:', query);
        const [result] = await db.query(query, [content, userId, image]);
        console.log('Resultado da inserção:', result);
        res.redirect('/profile');
    }catch (err){
        console.error('Erro ao adicionar post:', err);
        return res.status(500).send('Erro ao adicionar post');
    }
});

module.exports = router;