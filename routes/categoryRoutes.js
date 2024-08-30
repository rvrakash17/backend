const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {uploadCategoryImage} = require('../middlewares/upload'); // Assuming upload is configured for handling images
const authorizeAdmin = require('../middlewares/authorizationMiddleware');

// Route to create a new category
router.post('/', uploadCategoryImage.single('categoryImage'), authorizeAdmin,categoryController.createCategory);

// Route to update an existing category
router.put('/:id', uploadCategoryImage.single('categoryImage'), authorizeAdmin,categoryController.updateCategory);

// Route to delete a category
router.delete('/:id',authorizeAdmin, categoryController.deleteCategory);

// Route to get all categories
router.get('/', categoryController.getAllCategories);

// Route to get a specific category by ID
router.get('/:id', categoryController.getCategoryById);

module.exports = router;
