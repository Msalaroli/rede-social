const express = require('express');
const UserController = require('../Controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const { getAllUsers } = require('../Controllers/UserController');
const PostController = require('../Controllers/PostController');
const path = require('path');

const router = express.Router();

// Routes
router.post('/usuarios', (req, res) => {
    const nome = req.body.nome;
    const senha = req.body.senha;

    // Aqui você pode adicionar a lógica para processar os dados
    res.send(`Nome: ${nome}, Senha: ${senha}`);
});

router.get('/usuarios', (req, res) =>{
    res.sendFile(path.join(__dirname + '/../view/user.html'));
  });

router.get('/users', getAllUsers);
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/post', authMiddleware.verifyToken, PostController.addPost);
router.delete('/post/:postId', authMiddleware.verifyToken, PostController.deletePost);

module.exports = router;