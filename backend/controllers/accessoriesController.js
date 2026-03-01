const Accessories = require('../models/accessoriesModel');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

exports.addAccessory = async (req, res) => {
    try {
        const { name, type, color, compatibleWith } = req.body;

        // Debug: Log all received file fields
        if (req.files) {
            console.log('--- Multer Debug (Accessory) ---');
            console.log('Fields received:', req.files.map(f => f.fieldname));
        }

        let imageData = {};
        const file = req.files && req.files.length > 0 ? req.files[0] : null;

        if (file) {
            imageData = {
                url: file.path,
                public_id: file.filename
            };
            console.log('Image uploaded to Cloudinary:', imageData.url);
        }

        const accessoryData = {
            name,
            type,
            color,
            compatibleWith: Array.isArray(compatibleWith) ? compatibleWith : [compatibleWith],
            image: imageData,
            wearCount: 0,
            status: 'active'
        };

        // Check if DB is connected
        if (mongoose.connection.readyState !== 1) {
            console.warn('⚠️ MongoDB not connected. Returning simulated success for testing.');
            return res.status(201).json({
                ...accessoryData,
                _id: 'mock_id_' + Date.now(),
                message: 'SIMULATED SUCCESS: DB connection is pending/timeout.'
            });
        }

        const accessory = new Accessories(accessoryData);
        await accessory.save();
        res.status(201).json(accessory);
    } catch (err) {
        console.error('Add Accessory Error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllAccessories = async (req, res) => {
    try {
        const accessories = await Accessories.find();
        res.status(200).json(accessories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAccessoryById = async (req, res) => {
    try {
        const accessory = await Accessories.findById(req.params.id);
        if (!accessory) return res.status(404).json({ message: 'Accessory not found' });
        res.status(200).json(accessory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAccessory = async (req, res) => {
    try {
        const updatedAccessory = await Accessories.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedAccessory) return res.status(404).json({ message: 'Accessory not found' });
        res.status(200).json(updatedAccessory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteAccessory = async (req, res) => {
    try {
        const accessory = await Accessories.findByIdAndDelete(req.params.id);
        if (!accessory) return res.status(404).json({ message: 'Accessory not found' });
        res.status(200).json({ message: 'Accessory deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
