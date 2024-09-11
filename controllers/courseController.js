const CourseDetails = require('../models/CourseDetails');

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const { title, description, category, price, videos, pdfDocuments } = req.body;
        const courseImage = req.file ? req.file.path : '';
        const newCourse = new CourseDetails({
            title,
            description,
            category,
            price,
            courseImage,
            videos: JSON.parse(videos),
            pdfDocuments: JSON.parse(pdfDocuments)
        });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Edit an existing course
exports.editCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, price, videos, pdfDocuments } = req.body;
        const courseImage = req.file ? req.file.path : undefined;
        const updatedCourse = await CourseDetails.findByIdAndUpdate(id, {
            title,
            description,
            category,
            price,
            courseImage,
            videos: JSON.parse(videos),
            pdfDocuments: JSON.parse(pdfDocuments)
        }, { new: true });
        if (!updatedCourse) return res.status(404).json({ error: 'Course not found' });
        res.status(200).json(updatedCourse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await CourseDetails.findByIdAndDelete(id);
        if (!deletedCourse) return res.status(404).json({ error: 'Course not found' });
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await CourseDetails.find().populate('category');
        res.status(200).json(courses);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await CourseDetails.findById(id).populate('category');
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.status(200).json(course);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all courses by category ID
exports.getCoursesByCategoryId = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const courses = await CourseDetails.find({ category: categoryId }).populate('category');
        res.status(200).json(courses);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
