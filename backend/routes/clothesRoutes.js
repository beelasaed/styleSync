const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {
    addClothes,
    getAllClothes,
    getClothesById,
    updateClothes,
    deleteClothes
} = require('../controllers/clothesController');

router.post('/', upload.any(), addClothes);
router.get('/', getAllClothes);
router.get('/:id', getClothesById);
router.put('/:id', updateClothes);
router.delete('/:id', deleteClothes);

module.exports = router;
