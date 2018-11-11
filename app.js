const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./src/db/mongoose');
const { userRoutes } = require('./src/routes/users'); 
const { todoRoutes } = require('./src/routes/todos'); 
const app = express();

app.use(bodyParser.json());
app.get('/', (req, res, next)=>{ res.status(200).send('ok'); next(); });
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

module.exports = {app};


