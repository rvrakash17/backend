const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middlewares/authMiddleware');

// Route to create a new review
router.post('/', authenticateToken,reviewController.createReview);

// Route to update an existing review
router.put('/:id',authenticateToken, reviewController.updateReview);

// Route to delete a review
router.delete('/:id', authenticateToken,reviewController.deleteReview);

// Route to get all reviews for a specific product
router.get('/product/:productId', reviewController.getReviewsByProductId);


module.exports = router;
