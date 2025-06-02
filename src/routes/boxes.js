const express = require('express');
const router = express.Router();
const FiberBox = require('../models/FiberBox');
const { authenticateToken } = require('../middleware/auth');

// Proteger todas as rotas
router.use(authenticateToken);

// @route   GET /api/boxes
// @desc    Obter todas as caixas
// @access  Private
router.get('/', async (req, res) => {
  try {
    const boxes = await FiberBox.findAll();
    res.status(200).json(boxes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// @route   GET /api/boxes/:id
// @desc    Obter uma caixa específica
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const box = await FiberBox.findByPk(req.params.id);
    
    if (!box) {
      return res.status(404).json({ message: 'Caixa não encontrada' });
    }
    
    res.status(200).json(box);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// @route   POST /api/boxes
// @desc    Criar uma nova caixa
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, latitude, longitude, type, status, description, icon } = req.body;
    
    // Criar nova caixa
    const box = await FiberBox.create({
      name,
      latitude,
      longitude,
      type,
      status,
      description,
      icon,
      createdBy: req.user.id
    });
    
    res.status(201).json(box);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// @route   PUT /api/boxes/:id
// @desc    Atualizar uma caixa
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, latitude, longitude, type, status, description, icon } = req.body;
    
    // Verificar se a caixa existe
    let box = await FiberBox.findByPk(req.params.id);
    
    if (!box) {
      return res.status(404).json({ message: 'Caixa não encontrada' });
    }
    
    // Atualizar caixa
    await box.update({
      name,
      latitude,
      longitude,
      type,
      status,
      description,
      icon
    });
    
    // Obter caixa atualizada
    box = await FiberBox.findByPk(req.params.id);
    
    res.status(200).json(box);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// @route   DELETE /api/boxes/:id
// @desc    Remover uma caixa
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Verificar se a caixa existe
    const box = await FiberBox.findByPk(req.params.id);
    
    if (!box) {
      return res.status(404).json({ message: 'Caixa não encontrada' });
    }
    
    // Remover caixa
    await box.destroy();
    
    res.status(200).json({ success: true, message: 'Caixa removida com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
