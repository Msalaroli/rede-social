const UserModel = require('../Models/UserModel');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');

//Criando função para retornar todos os usuários e enviando para a rota
exports.getAllUsers = (req, res) => {
  UserModel.getAll((err, users) => {
    console.log(users)
    if (err) {
      res.status(500).send('Erro ao buscar usuários');
    } else {
      res.status(200).send(users);
    }
  });
};

//função para registro
exports.registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres' });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'A senha deve conter pelo menos uma letra, um número e um caractere especial' });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Usuário já cadastrado com este email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({ name, email, password: hashedPassword });

    res.status(201).json(newUser);
    
    const query = 'INSERT INTO usuarios (nome, senha, email) VALUES (?, ?, ?)'; //Query do MySQL
    //Inserindo MANUALMENTE dados na tabela (utilizando query acima)
    connection.query(query, [nome, senha], (err, result) => {
        if (err) { //Tratamento de Erro
            console.error('Erro ao inserir usuário:', err);
            return res.status(500).send('Erro ao inserir usuário');
        }
        res.status(201).send('Usuário inserido com sucesso');
      })

  } catch (err) {
    next(err);
  }
};

// função para logar
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // token JWT com expiração de 2 minutos
    const token = jwt.sign(
      { id: user.id, email: user.email },  
      process.env.TOKEN_KEY, 
      { expiresIn: '2m' }
    );

    res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (err) {
    next(err);
  }
};