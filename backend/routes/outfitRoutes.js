const express = require('express');
const router = express.Router();

const outfitController = require('../controllers/outfitController');

router.post('/generate', outfitController.generateOutfit);
router.post('/', outfitController.addOutfit);
router.get('/', outfitController.getAllOutfits);
router.get('/:id', outfitController.getOutfitById);
router.put('/:id', outfitController.modifyOutfitById);
router.delete('/:id', outfitController.deleteOutfitById);

module.exports = router;
