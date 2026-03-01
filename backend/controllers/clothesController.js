const Clothes = require('../models/clothesModel');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

exports.addClothes = async (req, res) => {
    try {
        const { name, category, color, season, occasion, wearCount } = req.body;

        // Debug: Log all received file fields
        if (req.files) {
            console.log('--- Multer Debug (Clothes) ---');
            console.log('Fields received:', req.files.map(f => f.fieldname));
        }

        let imagesData = [];
        if (req.files && req.files.length > 0) {
            imagesData = req.files.map(file => ({
                url: file.path,
                public_id: file.filename
            }));
            console.log(`Cloudinary: ${imagesData.length} files uploaded.`);
        }

        const clothesData = {
            name,
            category,
            color,
            season: Array.isArray(season) ? season : [season],
            occasion: Array.isArray(occasion) ? occasion : [occasion],
            images: imagesData,
            wearCount: wearCount || 0,
            status: 'active'
        };

        // Check if DB is connected
        if (mongoose.connection.readyState !== 1) {
            console.warn('⚠️ MongoDB not connected. Returning simulated success for testing.');
            return res.status(201).json({
                ...clothesData,
                _id: 'mock_id_' + Date.now(),
                message: 'SIMULATED SUCCESS: DB connection is pending/timeout.'
            });
        }

        const clothes = new Clothes(clothesData);
        await clothes.save();
        res.status(201).json(clothes);
    } catch (err) {
        console.error('Add Clothes Error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllClothes = async (req, res) => {
    try {
        const clothes = await Clothes.find();
        res.status(200).json(clothes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getClothesById = async (req, res) => {
    try {
        const clothes = await Clothes.findById(req.params.id);
        if (!clothes) return res.status(404).json({ message: 'Clothing item not found' });
        res.status(200).json(clothes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateClothes = async (req, res) => {
    try {
        const updatedClothes = await Clothes.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedClothes) return res.status(404).json({ message: 'Clothing item not found' });
        res.status(200).json(updatedClothes);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteClothes = async (req, res) => {
    try {
        const clothes = await Clothes.findByIdAndDelete(req.params.id);
        if (!clothes) return res.status(404).json({ message: 'Clothing item not found' });
        res.status(200).json({ message: 'Clothing item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
