const express = require('express');
const { BloodPressure, Calories, HeartRate, LatLong, Route, User, Weight } = require('../models');
const router = express.Router();
var cors = require('cors')

router.get('/bloodpressure', async (req, res) => {
    const result = await BloodPressure.findAll({ where: { user_id: req.user.id } })
    res.json({ message: 'success', result })
})

router.get('/bloodpressure/sorted', async (req, res) => {
    const result = await BloodPressure.findAll({ where: { user_id: req.user.id } })

    measure = [];
    time = [];

    result.forEach(function (item, index) {
        measure.push(item.get({ plain: true }).pressure)
        time.push(item.get({ plain: true }).createdAt)
    })

    res.json({ message: 'success', data: { measure, time } })
})

router.post('/bloodpressure', async (req, res) => {
    const result = await BloodPressure.create({
        pressure: req.body.pressure,
        user_id: req.user.id
    });

    res.json({ message: 'successfully created BloodPressure', result })
})

router.get('/calories', async (req, res) => {
    const result = await Calories.findAll({ where: { user_id: req.user.id } })
    res.json({ message: 'success', result })
})

router.post('/calories', async (req, res) => {
    const result = await Calories.create({
        calories: req.body.calories,
        user_id: req.user.id
    });

    res.json({ message: 'successfully created Calories', result })
})

router.get('/calories/sorted', async (req, res) => {
    const result = await Calories.findAll({ where: { user_id: req.user.id } })

    measure = [];
    time = [];

    result.forEach(function (item, index) {
        measure.push(item.get({ plain: true }).calories)
        time.push(item.get({ plain: true }).createdAt)
    })

    res.json({ message: 'success', data: { measure, time } })
})

router.get('/heartrate', async (req, res) => {
    const result = await HeartRate.findAll({ where: { user_id: req.user.id } })
    res.json({ message: 'success', result })
})

router.get('/heartrate/sorted', async (req, res) => {
    const result = await HeartRate.findAll({ where: { user_id: req.user.id } })

    rate = [];
    time = [];

    result.forEach(function (item, index) {
        rate.push(item.get({ plain: true }).rate)
        time.push(item.get({ plain: true }).createdAt)
    })

    res.json({ message: 'success', data: { rate, time } })
})

router.post('/heartrate', async (req, res) => {
    const result = await HeartRate.create({
        rate: req.body.rate,
        user_id: req.user.id
    });

    res.json({ message: 'successfully created HeartRate', result })
})

router.get('/latlong', async (req, res) => {
    const result = await LatLong.findAll({ where: { user_id: req.user.id } })
    res.json({ message: 'success', result })
})

router.get('/route', async (req, res) => {
    const result = await Route.findAll({ where: { user_id: req.user.id }, include: LatLong })
    res.json({ message: 'success', result })
})

router.get('/route/:name', async (req, res) => {
    const result = await Route.findOne({ where: { name: req.params.name, user_id: req.user.id }, include: LatLong })
    res.json({ message: 'success', result })
})

router.post('/route', async (req, res) => {
    const model = await Route.findOne({ where: { name: req.body.name, user_id: req.user.id } })

    if (!model) {
        const result = await Route.create({
            name: req.body.name,
            mode: req.body.mode,
            speed: req.body.speed,
            user_id: req.user.id
        });

        req.body.waypoints.forEach(async function (item, index) {
            waypoint = await LatLong.create({ lat: item.lat, long: item.lng, route_id: result.id })
        })
        res.json({ message: 'successfully created Route', result })
    } else {
        await Route.destroy({ where: { name: req.body.name, user_id: req.user.id }, include: LatLong })
        const result = await Route.create({
            name: req.body.name,
            mode: req.body.mode,
            speed: req.body.speed,
            user_id: req.user.id
        });

        req.body.waypoints.forEach(async function (item, index) {
            waypoint = await LatLong.create({ lat: item.lat, long: item.lng, route_id: result.id })
        })
        res.json({ message: 'successfully created Route', result})
    }

})

router.delete('/route/:name', async (req, res) => {
    const result = await Route.destroy({ where: { name: req.params.name, user_id: req.user.id } })

    res.json({ message: 'successfully delete Route', result })
})

router.get('/user', async (req, res) => {
    const result = await User.findByPk(req.user.id)
    res.json({ message: 'success', result })
})

router.get('/weight', async (req, res) => {
    const result = await Weight.findAll({ where: { user_id: req.user.id } })
    res.json({ message: 'success', result })
})

router.get('/weight/sorted', async (req, res) => {
    const result = await HeartRate.findAll({ where: { user_id: req.user.id } })

    weight = [];
    time = [];

    result.forEach(function (item, index) {
        weight.push(item.get({ plain: true }).weight)
        time.push(item.get({ plain: true }).createdAt)
    })

    res.json({ message: 'success', data: { weight, time } })
})

router.post('/weight', async (req, res) => {
    const result = await Weight.create({
        weight: req.body.weight,
        user_id: req.user.id
    });

    res.json({ message: 'successfully created Weight', result })
})

module.exports = router;