const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const isEmail = require('validator/lib/isEmail');
const TokenSchema = require('./tokenSchema');
const jwt  =  require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: { 
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique: true,
        validate:{
            validator: (value)=>{ return isEmail(value) },
            message: "{VALUE} is not a valid email address"
        }
    },
    password: {
        type: String,
        required: true,
        trim:true,
        minlength:6
    },
    tokens: [TokenSchema]
});


userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, ['_id','name','email']);
};

userSchema.methods.generateAuthToken = function() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({ _id: user._id.toHexString(), access }, "this_is_random_salt", { expiresIn: '1h' }).toString();
    user.tokens.push({access, token});
    return token;
    //return user.save()
                // .then(()=>{
                //  return Promise.resolve(token);
                // })
                // .catch(()=>{
                //     return Promise.reject();
                // });
};

userSchema.statics.findByToken = function(token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, "this_is_random_salt");
    } catch (error) {
        return Promise.reject(error);
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
};

userSchema.pre('save', function(next){

    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password  = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.statics.findByCredentials = function(email, password) {
    const User  = this;

   return User.findOne({email:email})
                .then((user)=>{
                    if (!user) {
                        return Promise.reject();
                    }

                    return new Promise((resolve, reject)=>{
                        bcrypt.compare(password, user.password, (err, result) => {
                            if (result) {
                                resolve(user);
                            } else {
                                reject();
                            }
                        });
                    });

                })
                .catch(()=>{
                    return Promise.reject();
                });

};

const User = mongoose.model('user', userSchema);

module.exports = { User };