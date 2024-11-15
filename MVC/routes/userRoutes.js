const express = require('express');
const UserController = require('../Controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const { getAllUsers } = require('../Controllers/UserController');
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

router.get('/addPost', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.render('addPost', { user: null });
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.render('addPost', { user: null });
        }
        res.render('addPost', { user: decoded });
    });
});

router.post('/post', authMiddleware.verifyToken, upload.single('image'), PostController.addPost);

router.get('/profile', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.render('user', { user: null, posts: [] });
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.render('user', { user: null, posts: [] });
        }

        const userId = decoded.id;
        db.query('SELECT * FROM posts WHERE user_id = ?', [userId], (err, results) => {
            if (err) {
                return res.status(500).send('Erro ao buscar posts');
            }
            res.render('user', { user: decoded, posts: results });
        });
    });
});

module.exports = router;