const Review = require('../models/Review');
const Product = require('../models/Product');

// Create a new review
exports.createReview = async (req, res) => {
  const { rating, comment, productId } = req.body;
  const userId = req.user._id;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newReview = new Review({
      rating,
      comment,
      user: userId,
      product: productId
    });

    const savedReview = await newReview.save();
    product.reviews.push(savedReview._id);
    await product.save();

    res.status(201).json({ message: 'Review created successfully', review: savedReview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing review
exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await Review.deleteOne({ _id: id });    
    const product = await Product.findById(review.product);
    if (product) {
      product.reviews.pull(id);
      await product.save();
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reviews for a specific product
exports.getReviewsByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId }).populate('user', 'fullName profilePic');
    if (!reviews.length) return res.status(404).json({ message: 'No reviews found for this product' });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
