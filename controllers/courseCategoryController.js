const CourseCategory = require('../models/CourseCategory');

// Create a new course category
exports.createCategory = async (req, res) => {
    try {
        const { courseCategoryName, courseCategoryDescription } = req.body;
        const courseCategoryImage = req.file ? req.file.path : '';
        const newCategory = new CourseCategory({
            courseCategoryName,
            courseCategoryDescription,
            courseCategoryImage
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Edit an existing course category
exports.editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseCategoryName, courseCategoryDescription } = req.body;
        const courseCategoryImage = req.file ? req.file.path : undefined;
        const updatedCategory = await CourseCategory.findByIdAndUpdate(id, {
            courseCategoryName,
            courseCategoryDescription,
            courseCategoryImage
        }, { new: true });
        if (!updatedCategory) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a course category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await CourseCategory.findByIdAndDelete(id);
        if (!deletedCategory) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all course categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await CourseCategory.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get a course category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CourseCategory.findById(id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
