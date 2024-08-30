const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');

// Create a new subcategory
exports.createSubcategory = async (req, res) => {
  const { subcategoryName, categoryId } = req.body;
  const subcategoryImage = req.file ? req.file.filename : '';

  try {
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const newSubcategory = new Subcategory({
      subcategoryName,
      subcategoryImage,
      category: categoryId,
    });

    const savedSubcategory = await newSubcategory.save();
    res.status(201).json({ message: 'Subcategory created successfully', subcategory: savedSubcategory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing subcategory
exports.updateSubcategory = async (req, res) => {
  const { id } = req.params;
  const { subcategoryName, categoryId } = req.body;
  const subcategoryImage = req.file ? req.file.filename : undefined;

  try {
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

    // Update subcategory fields
    subcategory.subcategoryName = subcategoryName || subcategory.subcategoryName;
    subcategory.category = categoryId || subcategory.category;
    
    if (subcategoryImage) {
      // Delete old subcategory image if it exists and is not the default image
      if (subcategory.subcategoryImage && subcategory.subcategoryImage !== 'default-subcategory-image.jpg') {
        const oldPicPath = path.join(__dirname, '..', 'images', 'subcategory', subcategory.subcategoryImage);
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath);
        }
      }
      // Update with the new subcategory image
      subcategory.subcategoryImage = subcategoryImage;
    }

    const updatedSubcategory = await subcategory.save();
    res.status(200).json({ message: 'Subcategory updated successfully', subcategory: updatedSubcategory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a subcategory
exports.deleteSubcategory = async (req, res) => {
  const { id } = req.params;

  try {
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

    // Delete the associated image if it exists and is not the default image
    if (subcategory.subcategoryImage && subcategory.subcategoryImage !== 'default-subcategory-image.jpg') {
      const imagePath = path.join(__dirname, '..', 'images', 'subcategory', subcategory.subcategoryImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Remove the subcategory from the database
    await Subcategory.deleteOne({ _id: id });
    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all subcategories
exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('category', 'categoryName');
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all subcategories by category ID
exports.getSubcategoriesByCategoryId = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const subcategories = await Subcategory.find({ category: categoryId }).populate('category', 'categoryName');
    if (!subcategories.length) return res.status(404).json({ message: 'No subcategories found for this category' });

    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get a category by ID
exports.getSubcategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) return res.status(404).json({ message: 'Sub Category not found' });

    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
