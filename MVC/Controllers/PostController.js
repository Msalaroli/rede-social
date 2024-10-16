const PostModel = require('../Models/PostModel');
const UserModel = require('../Models/UserModel');

// Adicionar um post ao usuário conectado
exports.addPost = async (req, res, next) => {
  try {
    const userId = req.user.id; // ID do usuário conectado a partir do JWT
    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Conteúdo da postagem é obrigatório' });
    }

    // Cria o post no banco de dados
    const newPost = await PostModel.createPost(content, image);

    // Adiciona o post à lista de postagens do usuário
    await UserModel.addPostToUser(userId, newPost.id);

    res.status(201).json({ message: 'Postagem criada com sucesso', post: newPost });
  } catch (err) {
    next(err);
  }
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
