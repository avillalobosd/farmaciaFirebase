'use strict';

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

var config    = require(__dirname + '/../config/config.json')['development'];
const db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}


const bancos = sequelize.define(
  'bancos',
  {
    sucursalId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cuentaId: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    monedaId: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(250),
      allowNull: false,
      validate: {
        len: {
          args: [1, 250],
          msg: 'El nombre debe ser entre 1 y 250 caracteres.'
        }
      }
    },
    numero: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: 'El número de cuenta debe ser entre 1 y 50 caracteres.'
        }
      }
    },
    banco: {
      type: DataTypes.STRING(250),
      allowNull: false,
      validate: {
        len: {
          args: [1, 250],
          msg: 'El nombre del banco debe ser entre 1 y 250 caracteres.'
        }
      }
    },
    tipo: {
      type: DataTypes.ENUM('EFECTIVO', 'CHEQUES', 'CREDITO'),
      allowNull: false,
      validate: {
        isIn: [['EFECTIVO', 'CHEQUES', 'CREDITO']]
      }
    }
  },
  {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    },
    indexes: [
      {
        fields: ['tipo', 'monedaId']
      },
      {
        unique: true,
        fields: ['sucursalId', 'nombre']
      }
    ]
  }
);
db[bancos.name] = bancos;



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
