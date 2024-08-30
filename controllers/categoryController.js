const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const path = require('path');
const fs = require('fs');

// Create a new category
exports.createCategory = async (req, res) => {
  const { categoryName } = req.body;
  const categoryImage = req.file ? req.file.filename : '';

  try {
    const newCategory = new Category({
      categoryName,
      categoryImage,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: savedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName } = req.body;
  const categoryImage = req.file ? req.file.filename : undefined;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Update category name if provided
    category.categoryName = categoryName || category.categoryName;

    // Handle category image update
    if (categoryImage) {
      // Delete old image if it exists and is not the default image
      if (category.categoryImage && category.categoryImage !== 'default-category-image.jpg') {
        const oldPicPath = path.join(__dirname, '..', 'images', 'category', category.categoryImage);
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath);
        }
      }
      // Update the category image with the new image
      category.categoryImage = categoryImage;
    }

    const updatedCategory = await category.save();
    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Delete the associated image if it exists and is not the default image
    if (category.categoryImage && category.categoryImage !== 'default-category-image.jpg') {
      const imagePath = path.join(__dirname, '..', 'images', 'category', category.categoryImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Remove the category from the database
    await Category.deleteOne({ _id: id });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
