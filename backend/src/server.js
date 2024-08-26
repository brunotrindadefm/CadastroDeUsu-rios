// Importações
const express = require('express');
const cors = require('cors');
const routes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const sequelize = require('./dbConfig/dbConfig')

// Sincroniza o modelo com o banco de dados
sequelize.sync().then(() => {
    console.log('Conectado ao banco de dados')
    app.listen(8000, () => {
        console.log("Listening on port 8000");
    })
}).catch(() => {
    console.log('Erro ao conectar ao banco de dados', error.message)
});
