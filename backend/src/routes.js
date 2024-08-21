const express = require('express');
const routes = express.Router();
require('dotenv').config();

// ORM (Object-Relational Mapper) para interagir com o banco de dados MySQL
const { Sequelize } = require('sequelize');

// Utilizados para definir o modelo User com Sequelize.
const { Model, DataTypes } = require('sequelize');

// Cria uma instância do Sequelize para conectar ao banco de dados
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});


// Sincroniza o modelo com o banco de dados
sequelize.sync()
    .then(() => console.log('Conectado no banco de dados'))
    .catch(() => console.log('Erro ao conectar no banco de dados', error));

class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    profession: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
});

// Método para transformar a primeira letra em maiúscula e o resto em minúscula
const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

routes.post('/users', async (req, res) => {
    try {
        const { name, lastName, profession, age } = req.body;

        // Validações
        const existingUser = await User.findOne({ where: { name, lastName } });
        if (existingUser) return res.status(400).send('Erro. Usuário com este nome já existe');
        if (age < 0) return res.status(400).send('Erro. Idade deve ser maior que 0');
        if (age > 111) return res.status(400).send('Erro. Não existe alguém com mais de 111 anos');
        if (name.includes(' ')) return res.status(400).send('Erro. Nome não deve conter espaços. Use apenas um nome');
        if (lastName.includes(' ')) return res.status(400).send('Erro. Sobrenome não deve conter espaços. Use apenas um nome');
        if (!/[a-zA-Z]/.test(name)) return res.status(400).send('Erro. Nome deve conter letras');
        if (!/[a-zA-Z]/.test(lastName)) return res.status(400).send('Erro. Sobrenome deve conter letras');
        if (!/[a-zA-Z]/.test(profession)) return res.status(400).send('Erro. Profissão deve conter letras');

        const capitalizedFirstName = capitalizeFirstLetter(name);
        const capitalizedLastName = capitalizeFirstLetter(lastName);
        const capitalizedProfession = capitalizeFirstLetter(profession);

        // Criando o usuário pegando o que foi digitado no form do frontend
        await User.create({ name: capitalizedFirstName, lastName: capitalizedLastName, profession: capitalizedProfession, age });
        res.status(201).send('Usuário cadastrado com sucesso');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
});

routes.get('/users', async (req, res) => {
    try {
        // findAll() = select * from users;
        const users = await User.findAll();
        if (users.length === 0) return res.status(404).send('Nenhum usuário cadastrado');

        // Retornando todos os usuários
        res.json(users);

    } catch (error) {
        res.status(500).send('Erro ao buscar usuários')
    }
});

routes.delete('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        // findByPk método para achar o usuário pelo id;
        const user = await User.findByPk(userId);

        if (!user) return res.status(404).send('Erro. Usuário não encontrado!');

        // Excluindo usuário
        await user.destroy();

        res.status(200).send('Usuário deletado com sucesso');
    } catch (error) {
        res.status(500).send('Erro ao deletar usuário');
    }
});

routes.put('/users/:id', async (req, res) => {
    const { name, lastName, profession, age } = req.body;
    const userId = parseInt(req.params.id);
    try {

        //  findByPk método para achar o usuário pelo id;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).send('Erro. Usuário não encontrado!');

        // Validações
        if (age < 0) return res.status(400).send('Erro. Idade deve ser maior que 0');
        if (age > 111) return res.status(400).send('Erro. Não existe alguém com mais de 111 anos');
        if (name.includes(' ')) return res.status(400).send('Erro. Nome não deve conter espaços. Use apenas um nome');
        if (lastName.includes(' ')) return res.status(400).send('Erro. Sobrenome não deve conter espaços. Use apenas um nome');
        if (!/[a-zA-Z]/.test(name)) return res.status(400).send('Erro. Nome deve conter letras');
        if (!/[a-zA-Z]/.test(lastName)) return res.status(400).send('Erro. Sobrenome deve conter letras');
        if (!/[a-zA-Z]/.test(profession)) return res.status(400).send('Erro. Profissão deve conter letras');

        // Atualizando o usuário pegando o que foi digitado no edit do frontend
        await user.update({ name, lastName, profession, age });
        res.send('Usuário atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).send('Erro ao atualizar usuário');
    }
});

module.exports = routes;