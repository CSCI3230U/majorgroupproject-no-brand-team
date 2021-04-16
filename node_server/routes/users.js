const passport = require('passport');

const signin = async (req, res, next) => {
    await passport.authenticate('login', async (err, user) => {
        if (err) {
            res.sendStatus(403);
        }

        if (!user) {
            res.sendStatus(404)
        }

        console.log('test')
    })
    res.json({ status: 201, message: 'hit' })
}

module.exports = {
    signin
}