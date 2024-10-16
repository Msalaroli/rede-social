const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  // Permitir requisições para login e cadastro sem verificar o token
  if (req.path === '/login' || req.path === '/register') {
    return next();
  }

  // Se o token não for fornecido
  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido' });
  }

  // Verifica e decodifica o token
  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }

    // Adiciona os dados do usuário no objeto `req` para serem usados nas próximas funções
    req.user = decoded;
    next();
  });
};