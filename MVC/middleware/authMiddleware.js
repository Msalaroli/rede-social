const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT
exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  // Permitir requisições para login, registro e outras páginas públicas sem verificar o token
  if (req.path === '/login' || req.path === '/register' || req.path === '/posts' || req.path === '/addPost') {
    return next();
  }

  // Se o token não for fornecido
  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    console.log('Token verificado com sucesso:', decoded);
    next();
  } catch (err) {
    console.log('Token inválido ou expirado:', err);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};