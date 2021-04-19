const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const jwtConfig = require('../config/jwt_config');
require('../config/passport');
const User = require('../models').User;
const Sequelize = require('sequelize');

const util = require('util');
const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);

router.post('/signup', async function (req, res) {
    try {
        const response = await registerUser(req);

        res.json({ success: true, user: user });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

registerUser = async function (req) {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ msg: "Please enter an email and pasword." })
    } else {
        user = await User.create(req.body)

        const token = await jwtSign(
            {
                id: user.id,
            },
            jwtConfig.secret,
            { expiresIn: '60m' },
        );
        user.setDataValue('token', token)

        return user
    }
}


router.post('/signin', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        console.log(user.id)
        console.log(token)
        const token = await jwtSign(
            {
                id: user.id,
            },
            jwtConfig.secret,
            { expiresIn: '24h' },
        );

        res.json({user: user, token: token})
    })(req, res, next);
})

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;