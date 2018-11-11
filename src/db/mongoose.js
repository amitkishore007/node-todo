const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/todoApp', { useNewUrlParser: true });

mongoose.connection
    .once('open', () => { console.log('connected to mongodb'); })
    .on('error', (error) => { console.warn('Warning', error); });

module.exports = {
    mongoose
};

