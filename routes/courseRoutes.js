const express = require('express');
const router = express.Router();
const { uploadCourseImage, uploadVideo, uploadPdf } = require('../middlewares/upload');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeAdmin = require('../middlewares/authorizationMiddleware');
const courseController = require('../controllers/courseController');

// Admin routes for courses
router.post('/', authenticateToken, authorizeAdmin, uploadCourseImage.single('courseImage'), uploadVideo.array('videos'), uploadPdf.array('pdfDocuments'), courseController.createCourse);
router.put('/:id', authenticateToken, authorizeAdmin, uploadCourseImage.single('courseImage'), uploadVideo.array('videos'), uploadPdf.array('pdfDocuments'), courseController.editCourse);
router.delete('/:id', authenticateToken, authorizeAdmin, courseController.deleteCourse);

// Public routes for courses
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/category/:categoryId', courseController.getCoursesByCategoryId);

module.exports = router;
