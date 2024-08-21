// Importações
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
    res.send("Opa! Bão?");
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
})