const Laundry = require('../models/laundryModel');
const Clothes = require('../models/clothesModel');
const mongoose = require('mongoose');

exports.addLaundry = async (req, res) => {
    try {
        // Check if DB is connected
        if (mongoose.connection.readyState !== 1) {
            console.warn('⚠️ MongoDB not connected. Returning simulated success for laundry.');
            return res.status(201).json({
                ...req.body,
                _id: 'mock_laundry_' + Date.now(),
                message: 'SIMULATED SUCCESS: DB connection is pending/timeout.'
            });
        }

        const laundry = new Laundry(req.body);
        await laundry.save();

        // Update items status to 'laundry'
        if (req.body.items && req.body.items.length > 0) {
            await Clothes.updateMany(
                { _id: { $in: req.body.items } },
                { $set: { status: 'laundry' } }
            );
        }

        res.status(201).json(laundry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.updateLaundry = async (req, res) => {
    try {
        // Check if DB is connected
        if (mongoose.connection.readyState !== 1) {
            console.warn('⚠️ MongoDB not connected. Returning simulated success for update laundry.');
            return res.json({
                ...req.body,
                _id: req.params.id,
                message: 'SIMULATED SUCCESS'
            });
        }

        const laundry = await Laundry.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // If laundry is marked as 'done', set items back to 'active'
        if (req.body.status === 'done') {
            await Clothes.updateMany(
                { _id: { $in: laundry.items } },
                { $set: { status: 'active' } }
            );
        }

        res.json(laundry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllLaundry = async (req, res) => {
    try {
        const laundry = await Laundry.find().populate('items');
        res.status(200).json(laundry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteLaundry = async (req, res) => {
    try {
        const laundry = await Laundry.findByIdAndDelete(req.params.id);
        if (!laundry) return res.status(404).json({ message: 'Laundry log not found' });
        res.status(200).json({ message: 'Laundry log deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
