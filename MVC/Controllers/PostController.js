const PostModel = require('../Models/PostModel');
const UserModel = require('../Models/UserModel');
const db = require('../Config/db');

// Adicionar um post ao usuário conectado
exports.addPost = (req, res) => {
    const { content } = req.body;
    const userId = req.user.id; // Assumindo que o ID do usuário está no token JWT
    const image = req.file ? req.file.filename : null;

    const query = 'INSERT INTO posts (content, user_id, image) VALUES (?, ?, ?)';
    db.query(query, [content, userId, image], (err, result) => {
        if (err) {
            return res.status(500).send('Erro ao adicionar post');
        }
        res.redirect('/posts'); // Redireciona de volta para a página de posts
    });
};

// Deletar um post do usuário conectado
exports.deletePost = async (req, res, next) => {
  try {
    const userId = req.user.id; // ID do usuário conectado a partir do JWT
    const { postId } = req.params;

    // Verifica se o post pertence ao usuário conectado
    const isOwner = await UserModel.isPostOwner(userId, postId);
    if (!isOwner) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar esta postagem' });
    }

    // Deleta a postagem
    await PostModel.deletePost(postId);

    res.status(200).json({ message: 'Postagem deletada com sucesso' });
  } catch (err) {
    next(err);
  }
};
