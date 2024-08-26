const User = require('../models/userModels');

// Método para transformar a primeira letra em maiúscula e o resto em minúscula
const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const createUser = async (req, res) => {
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

        // Criando o usuário
        await User.create({ name: capitalizedFirstName, lastName: capitalizedLastName, profession: capitalizedProfession, age });
        res.status(201).send('Usuário cadastrado com sucesso');

    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    };
};

const getUsers = async (req, res) => {
    try {

        const users = await User.findAll();
        if (users.length === 0) return res.status(404).send('Erro. Nenhum usuário cadastrado.')
        res.json(users);

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Erro interno no servidor')
    }
};

const deleteUser = async (req, res) => {
    try {

        const userId = Number(req.params.id);
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).send('Erro. Usuário não encontrado.');
        await user.destroy();
        res.status(200).send('Usuário deletado com sucesso');

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Erro interno no servidor');
    }
};

const updateUser = async (req, res) => {
    try {

        const { name, lastName, profession, age } = req.body;
        const userId = Number(req.params.id);

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

        await user.update({ name, lastName, profession, age });
        res.status(201).send('Usuário editado com sucesso!')

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Erro interno no servidor.');
    }
};

module.exports = {
    createUser,
    getUsers,
    deleteUser,
    updateUser
};