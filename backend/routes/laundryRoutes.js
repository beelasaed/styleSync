const express = require('express');
const router = express.Router();
const {
    addLaundry,
    updateLaundry,
    getAllLaundry,
    deleteLaundry
} = require('../controllers/laundryController');

router.post('/', addLaundry);
router.get('/', getAllLaundry);
router.put('/:id', updateLaundry);
router.delete('/:id', deleteLaundry);

module.exports = router;
