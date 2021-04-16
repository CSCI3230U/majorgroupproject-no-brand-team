const express = require('express');
const { BloodPressure, Calories, HeartRate, LatLong, Route, User, Weight } = require('../models');
const router = express.Router();

router.get('/bloodpressure', async (req, res, next) => {
    const result = await BloodPressure.findAll({where: {user_id: req.user.id}})
    res.json({message: 'success', result})
})

router.get('/calories', async (req, res, next) => {
    const result = await Calories.findAll({where: {user_id: req.user.id}})
    res.json({message: 'success', result})
})

router.get('/heartrate', async (req, res, next) => {
    const result = await HeartRate.findAll({where: {user_id: req.user.id}})
    res.json({message: 'success', result})
})

router.get('/latlong', async (req, res, next) => {
    const result = await LatLong.findAll({where: {user_id: req.user.id}})
    res.json({message: 'success', result})
})

router.get('/route', async (req, res, next) => {
    const result = await Route.findAll({where: {user_id: req.user.id}})
    res.json({message: 'success', result})
})

router.get('/user', async (req, res, next) => {
    const result = await User.findByPk(req.user.id)
    res.json({message: 'success', result})
})

router.get('/weight', async (req, res, next) => {
    const result = await Weight.findAll({where: {user_id: req.user.id}})
    res.json({message: 'success', result})
})

module.exports = router;