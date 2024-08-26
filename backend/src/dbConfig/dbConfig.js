// ORM (Object-Relational Mapper) para interagir com o banco de dados MySQL
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Cria uma instância do Sequelize para conectar ao banco de dados
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

module.exports = sequelize;