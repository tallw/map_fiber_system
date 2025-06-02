const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const FiberBox = sequelize.define('FiberBox', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ativo', 'inativo', 'manutenção'),
    defaultValue: 'ativo'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

// Relacionamento com usuário
FiberBox.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = FiberBox;
