const express = require('express');
const userRoutes = express.Router();
const UserController = require('../controllers/UsersController');
const auth = require('../middlewares/auth');

userRoutes.post('/', UserController.create);
userRoutes.get('/', auth, UserController.all);
userRoutes.post('/login', UserController.login);

module.exports = { userRoutes };