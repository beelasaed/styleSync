const Clothes = require('../models/clothesModel');

// ---Wardrobe Analytics ---
exports.wardrobeAnalytics = async (req, res) => {
    try {

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const mostUsed = await Clothes.find({ 
            wearCount: { $gte: 7 }, 
            status: 'active' 
        });

        const donationSuggestions = await Clothes.find({
            status: 'active',
            $or: [
                { wearCount: { $lte: 2 } },
                { lastWorn: { $lte: oneYearAgo } },
                { lastWorn: null }
            ]
        });

        res.json({
            summary: {
                totalActiveItems: await Clothes.countDocuments({ status: 'active' }),
                mostUsedCount: mostUsed.length,
                donationCandidatesCount: donationSuggestions.length
            },
            mostUsedItems: mostUsed,
            donationSuggestions: donationSuggestions
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};