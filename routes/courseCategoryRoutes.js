const express = require('express');
const router = express.Router();
const { uploadCourseCategoryImage } = require('../middlewares/upload');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeAdmin = require('../middlewares/authorizationMiddleware');
const courseCategoryController = require('../controllers/courseCategoryController');

// Admin routes for course categories
router.post('/', authenticateToken, authorizeAdmin, uploadCourseCategoryImage.single('courseCategoryImage'), courseCategoryController.createCategory);
router.put('/:id', authenticateToken, authorizeAdmin, uploadCourseCategoryImage.single('courseCategoryImage'), courseCategoryController.editCategory);
router.delete('/:id', authenticateToken, authorizeAdmin, courseCategoryController.deleteCategory);

// Public routes for course categories
router.get('/', courseCategoryController.getAllCategories);
router.get('/:id', courseCategoryController.getCategoryById);

module.exports = router;
