const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// Create a new product
exports.createProduct = async (req, res) => {
  const { productName, description, price, subcategory, stock, isFeatured, originalPrice, discountPrice, specifications } = req.body;
  const images = req.files ? req.files.map(file => file.filename) : [];

  try {
    const newProduct = new Product({
      productName,
      description,
      price,
      subcategory,
      images,
      stock,
      isFeatured,
      originalPrice,
      discountPrice,
      specifications
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, description, price, subcategory, stock, isFeatured, originalPrice, discountPrice, specifications } = req.body;
  const images = req.files ? req.files.map(file => file.filename) : undefined;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.productName = productName || product.productName;
    product.description = description || product.description;
    product.price = price || product.price;
    product.subcategory = subcategory || product.subcategory;
    product.stock = stock || product.stock;
    product.isFeatured = isFeatured || product.isFeatured;
    product.originalPrice = originalPrice || product.originalPrice;
    product.discountPrice = discountPrice || product.discountPrice;
    product.specifications = specifications || product.specifications;

    if (images) {
      // Delete old images if necessary
      product.images.forEach(image => {
        const oldPicPath = path.join(__dirname, '..', 'images', 'products', image);
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath);
        }
      });
      product.images = images;
    }

    const updatedProduct = await product.save();
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete associated images
    product.images.forEach(image => {
      const imagePath = path.join(__dirname, '..', 'images', 'products', image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Product.deleteOne({ _id: id });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate('subcategory').populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'fullName profilePic'
      }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('subcategory').populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'fullName profilePic'
      }
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get products by subcategory ID
exports.getProductsBySubcategoryId = async (req, res) => {
  const { subcategoryId } = req.params;

  try {
    const products = await Product.find({ subcategory: subcategoryId }).populate('subcategory').populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'fullName profilePic'
      }
    });

    if (!products.length) return res.status(404).json({ message: 'No products found for this subcategory' });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
