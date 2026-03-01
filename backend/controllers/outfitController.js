const Outfit = require('../models/outfitModel');
const Clothes = require('../models/clothesModel');
const Accessories = require('../models/accessoriesModel');
const Weather = require('../models/weatherModel');
const Laundry = require('../models/laundryModel');

exports.generateOutfit = async (req, res) => {
  try {
    const { location, occasion } = req.body;

    // A. Get latest weather for the location
    const weatherLog = await Weather.findOne({ location }).sort({ date: -1 });
    const condition = weatherLog ? weatherLog.conditions : 'sunny';

    // B. Map weather condition to season
    let currentSeason = 'summer';
    if (condition === 'cold') currentSeason = 'winter';
    if (condition === 'rainy') currentSeason = 'rainy';
    if (condition === 'hot') currentSeason = 'summer';
    if (condition === 'cloudy') currentSeason = 'spring';

    // C. Find clothes currently in laundry (not done)
    const activeLaundry = await Laundry.find({ status: { $ne: 'done' } });
    const dirtyItemIds = activeLaundry.flatMap(l => l.items);

    // D. Build clothes query
    const query = {
      status: 'active',
      _id: { $nin: dirtyItemIds },
      season: { $in: [currentSeason] }
    };

    if (occasion) {
      query.occasion = { $in: [occasion] };
    }

    const validClothes = await Clothes.find(query);

    // E. Split clothes by category
    const tops = validClothes.filter(c => c.category === 'top');
    const bottoms = validClothes.filter(c => c.category === 'bottom');
    const dresses = validClothes.filter(c => c.category === 'dress');

    let selectedClothes = [];
    let categoriesForAccessories = [];

    // F. Outfit selection logic
    if (dresses.length > 0 && Math.random() > 0.5) {
      const randomDress = dresses[Math.floor(Math.random() * dresses.length)];
      selectedClothes.push(randomDress);
      categoriesForAccessories.push('dress');
    } else if (tops.length > 0 && bottoms.length > 0) {
      const randomTop = tops[Math.floor(Math.random() * tops.length)];
      const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
      selectedClothes.push(randomTop, randomBottom);
      categoriesForAccessories.push('top', 'bottom');
    } else {
      return res.status(404).json({
        message: `No clean ${currentSeason} outfit found for ${occasion || 'any occasion'}.`
      });
    }

    // G. Select compatible accessories
    const allAccessories = await Accessories.find({ status: 'active' });
    const compatibleAccessories = allAccessories.filter(acc =>
      acc.compatibleWith.some(cat => categoriesForAccessories.includes(cat))
    );

    const selectedAccessories = compatibleAccessories
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    // H. Save outfit
    const newOutfit = new Outfit({
      name: `Generated ${currentSeason} Outfit`,
      clothingItems: selectedClothes.map(c => c._id),
      accessories: selectedAccessories.map(a => a._id),
      weatherCondition: condition,
      wearCount: 1
    });

    await newOutfit.save();

    // I. Update wear counts
    await Promise.all([
      ...selectedClothes.map(c =>
        Clothes.findByIdAndUpdate(c._id, {
          $inc: { wearCount: 1 },
          lastWorn: new Date()
        })
      ),
      ...selectedAccessories.map(a =>
        Accessories.findByIdAndUpdate(a._id, {
          $inc: { wearCount: 1 },
          lastWorn: new Date()
        })
      )
    ]);

    // J. Return populated outfit
    const result = await Outfit.findById(newOutfit._id)
      .populate('clothingItems')
      .populate('accessories');

    res.status(201).json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addOutfit = async (req, res) => {
  try {
    const newOutfit = new Outfit(req.body);
    await newOutfit.save();
    res.status(201).json(newOutfit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllOutfits = async (req, res) => {
  try {
    const outfits = await Outfit.find()
      .populate('clothingItems')
      .populate('accessories');
    res.status(200).json(outfits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOutfitById = async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id)
      .populate('clothingItems')
      .populate('accessories');
    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }
    res.status(200).json(outfit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.modifyOutfitById = async (req, res) => {
  try {
    const updatedOutfit = await Outfit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedOutfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }
    res.status(200).json(updatedOutfit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOutfitById = async (req, res) => {
  try {
    const outfit = await Outfit.findByIdAndDelete(req.params.id);
    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }
    res.status(200).json({ message: 'Outfit deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
