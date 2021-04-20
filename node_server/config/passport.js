const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const jwtConfig = require('./jwt_config');

const User = require('../models').User;

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfig.secret,
};

passport.use(
    'login',
    new LocalStrategy({

        usernameField: 'email',
        passwordField: 'password'
    },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ where: {'email': email} });
                if (!user){
                    return done(null, false)
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch){
                    return done(null, false)
                }
                
                return done(null, user)
            } catch (err) {
                console.log(err);
                return done(err)
            }
        },
    ),
);

passport.use(
    'jwt',
    new JWTStrategy(opts, async (jwtPayload, done) => {
        try {
            const user = await User.findByPk(jwtPayload.id)
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }),
);