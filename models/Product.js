const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  images: [String],
  stock: { type: Number, required: true },
  isFeatured: { type: Boolean, default: false },
  originalPrice: { type: Number },
  discountPrice: { type: Number },
  specifications: [
    {
      key: String,
      value: String
    }
  ],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
