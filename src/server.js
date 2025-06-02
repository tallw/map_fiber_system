const express = require('express');
const cors = require('cors');
const { sequelize, connectDB } = require('./config/db');
require('dotenv').config();

// Importar modelos
const User = require('./models/User');
const FiberBox = require('./models/FiberBox');

// Importar rotas
const authRoutes = require('./routes/auth');
const boxesRoutes = require('./routes/boxes');

// Conectar ao banco de dados
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Sincronizar modelos com o banco de dados
sequelize.sync({ alter: true }).then(() => {
  console.log('Modelos sincronizados com o banco de dados');
}).catch(err => {
  console.error('Erro ao sincronizar modelos:', err);
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/boxes', boxesRoutes);

// Rotas básicas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

// Definir porta
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
