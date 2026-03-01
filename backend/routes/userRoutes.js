const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

router.post('/', upload.single('profilePicture'), createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', upload.single('profilePicture'), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
