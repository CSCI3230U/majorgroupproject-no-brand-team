const express = require('express');
const router = require('express').Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require("./models")
const app = express();

db.sequelize.sync()


// const v1 = require('./routes/v1');
// const v1NoAuth = require('./routes/v1_no_auth');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.json({"message": "Welcome"});
})


// app.listen('/v1', v1NoAuth);

module.exports = app;