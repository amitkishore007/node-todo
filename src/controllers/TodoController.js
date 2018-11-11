const { Todo } = require('../models/todo');
module.exports = {

    create(req, res, next) {
        const todo = new Todo(req.body);
        todo.save()
            .then((result) => res.status(200).json({ status: 'success', data: result }))
            .catch((error) => res.status(500).json({ status: 'failed', errors: error.message }));
    }
};