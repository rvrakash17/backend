const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { uploadProductImages } = require('../middlewares/upload'); // Import the upload function
const authorizeAdmin = require('../middlewares/authorizationMiddleware');

// Route to create a new product
router.post('/', uploadProductImages.array('productImages', 5), authorizeAdmin ,productController.createProduct);

// Route to update an existing product
router.put('/:id', uploadProductImages.array('images', 5), authorizeAdmin ,productController.updateProduct);

// Route to delete a product
router.delete('/:id', authorizeAdmin ,productController.deleteProduct);

// Route to get a product by ID
router.get('/:id', productController.getProductById);

// Route to get all products
router.get('/', productController.getAllProducts);

// Route to get products by subcategory ID
router.get('/subcategory/:subcategoryId', productController.getProductsBySubcategoryId);

module.exports = router;
