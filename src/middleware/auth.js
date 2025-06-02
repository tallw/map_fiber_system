const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para autenticação de token JWT
const authenticateToken = async (req, res, next) => {
  try {
    // Verificar se o header de autorização existe
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acesso não autorizado' });
    }

    // Extrair token
    const token = authHeader.split(' ')[1];

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Adicionar usuário à requisição
      req.user = decoded;
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

module.exports = { authenticateToken };
