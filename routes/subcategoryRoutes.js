const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const {uploadSubcategoryImage} = require('../middlewares/upload'); // Assuming upload is configured for handling images
const authorizeAdmin = require('../middlewares/authorizationMiddleware');

// Route to create a new subcategory
router.post('/', uploadSubcategoryImage.single('subcategoryImage'),authorizeAdmin, subcategoryController.createSubcategory);

// Route to update an existing subcategory
router.put('/:id', uploadSubcategoryImage.single('subcategoryImage'), authorizeAdmin,subcategoryController.updateSubcategory);

// Route to delete a subcategory
router.delete('/:id', authorizeAdmin,subcategoryController.deleteSubcategory);

// Route to get all subcategories
router.get('/', subcategoryController.getAllSubcategories);

// Route to get a specific sub category by ID
router.get('/:id', subcategoryController.getSubcategoryById);

// Route to get all subcategories by category ID
router.get('/category/:categoryId', subcategoryController.getSubcategoriesByCategoryId);

module.exports = router;
