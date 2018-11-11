const { User } = require('../models/user');
const _  = require('lodash');


module.exports = {

    create(req, res, next) {
        const user = new User(_.pick(req.body, ['name','email','password']));
        token = user.generateAuthToken();
        user.save()
            .then((result) => {
                return res.header('x-auth', token).status(200).json({ status: 'success', data: result });
            })
            .catch((error)=> res.status(500).json({status:'failed', errors: error.message}));
    },
    all(req, res, next) {
        User.find({})
            .then((users)=>{
                return res.status(200).json({satus:"success", data:users});
            })
            .catch(()=>{
               return res.status(500).json({satus:"failed", errors:"could not fetch users"});
            })
    },
    login(req, res, next) {
        User.findByCredentials(req.body.email, req.body.password)
            .then((user) => {
                return res.header('x-auth', user.tokens[0].token).status(200).json({staus:"success", data:user});
            })
            .catch(()=>{
                return res.status(401).json({staus:"failed", errors:"Email/password did not match"});
            })
    }
};