const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

module.exports = (req, res, next) => {

    if (!req.header('x-auth')) 
    {
        return res.status(401).json({ status: 'failed', errors: "unauthorized" }); 
    }
    
    const xAuth = req.header('x-auth').split(' ');
    if (xAuth[0] !='Bearer' || !xAuth[1]) 
    {
        return res.status(401).json({ status: 'failed', errors: "unauthorized" }); 
    }

    
    User.findByToken(xAuth[1])
        .then((user)=>{
            if (!user) {
                return Promise.reject();
            }

            req.user = user;
            req.token = xAuth[1];
            next();
        })
        .catch(()=>{
            return res.status(401).json({ status: 'failed', errors: "unauthorized" }); 
        });
};