const express = require('express');
const UserController = require('../Controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const { getAllUsers } = require('../Controllers/UserController');
const PostController = require('../Controllers/PostController');
const path = require('path');
const db = require('../Config/db');

const router = express.Router();

// Routes
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', UserController.registerUser);

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', UserController.loginUser);

router.get('/posts', (req, res) => {
    db.query('SELECT * FROM posts', (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar posts');
        }
        res.render('posts', { posts: results });
    });
});

router.get('/addPost', authMiddleware.verifyToken, (req, res) => {
    res.render('addPost');
});

router.post('/post', authMiddleware.verifyToken, PostController.addPost);

router.get('/profile', authMiddleware.verifyToken, (req, res) => {
    const userId = req.user.id;
    db.query('SELECT * FROM posts WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar posts');
        }
        res.render('user', { user: req.user, posts: results });
    });
});

module.exports = router;