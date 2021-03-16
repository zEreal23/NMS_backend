const jwt = require('jsonwebtoken'); //to generate signed token
const expressJwt = require('express-jwt'); //for authorization check

const User = require('../models/user');

exports.signup = (req, res) => {
    console.log('req.body', req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({error: 'Email is taken'});
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({user});
    });
};

exports.signin = (req, res) => {
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist, Please signup',
            });
        }
        //check email and password match
        //crate authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and Password not match',
            });
        }
        //generate a signed token with user id and secret
        const token = jwt.sign({_id: user._id, role: user.role}, 'hasdksajdksadjsacnkcaksdjas');
        //persist the token as 't' in cookie with expirt date
        res.cookie('t', token, {expire: new Date() + 9999});
        //return response with user and token to frontend client
        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}});
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({message: 'Signout success'});
};

exports.requireSignin = expressJwt({
    secret: 'hasdksajdksadjsacnkcaksdjas',
    algorithms: ['HS256'],
    userProperty: 'auth',
});

exports.isAuth = (req, res, next) => {
    const isRequest = req.profile && req.auth;
    if (!isRequest) {
        return res.status(400).json({
            message: 'Bad Request',
        });
    }

    const sameuser = String(req.profile._id) === String(req.auth._id);
    const admin = req.auth.role === "admin";

    if (!admin) {
        if (!sameuser) {
            return res.status(403).json({
                message: 'Access Denied',
            });
        }
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (!req.profile.role === "admin"||!req.profile.role === "staff") {
        return res.status(403).json({
            error: 'Admin resourse! Access denied',
        });
    }
    next();
};
