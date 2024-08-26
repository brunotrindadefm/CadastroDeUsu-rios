const express = require('express');
const routes = express.Router();
const userController = require('../controllers/userController')

routes.post('/users', userController.createUser);
routes.get('/users', userController.getUsers);
routes.delete('/users/:id', userController.deleteUser);
routes.put('/users/:id', userController.updateUser);

module.exports = routes;