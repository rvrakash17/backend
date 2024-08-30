const express = require('express');
const addressController = require('../controllers/addressController'); // Correctly import the addressController
const  authenticateToken  = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to create or update address
router.post('/address', authenticateToken, addressController.upsertAddress); // Ensure upsertAddress is correctly imported

// Route to get address
router.get('/address', authenticateToken, addressController.getAddress); // Ensure getAddress is correctly imported

module.exports = router;
