const Weather = require('../models/weatherModel');

exports.addWeather = async (req, res) => {
    try {
        const { location, conditions, date } = req.body
        const weather = new Weather({
            location, conditions, date
        });

        await weather.save();
        res.status(201).json(weather);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllWeather = async (req, res) => {
    try {
        const weather = await Weather.find().sort({ date: -1 });
        res.status(200).json(weather);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteWeather = async (req, res) => {
    try {
        const weather = await Weather.findByIdAndDelete(req.params.id);
        if (!weather) {
            return res.status(404).json({ message: 'Weather record not found' });
        }
        res.status(200).json({ message: 'Weather record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
