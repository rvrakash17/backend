const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
  subcategoryName: { type: String, required: true, unique: true,trim: true },
  subcategoryImage: { type: String, default: '' }, // Path to the image file
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to the Category model
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;
