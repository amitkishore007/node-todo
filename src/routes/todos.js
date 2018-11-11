const express = require('express');
const todoRoutes = express.Router();
const  TodoController  = require('../controllers/TodoController');

todoRoutes.post('/', TodoController.create);

module.exports = { todoRoutes };