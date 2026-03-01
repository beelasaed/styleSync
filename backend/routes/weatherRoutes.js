const express = require('express');
const router = express.Router();
const {
    addWeather,
    getAllWeather,
    deleteWeather
} = require('../controllers/weatherController');

router.post('/', addWeather);
router.get('/', getAllWeather);
router.delete('/:id', deleteWeather);

module.exports = router;
