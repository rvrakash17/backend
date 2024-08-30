const multer = require('multer');
const path = require('path');

// Utility function to create multer storage
const createStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      cb(null, `${req.user ? req.user._id : 'image'}${timestamp}${ext}`); // Use user ID or 'unknown'
    }
  });
};

// Utility function to create multer upload instance
const createUpload = (destination) => {
  return multer({
    storage: createStorage(destination),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
  });
};

// Functions for different upload types
const uploadProfileImage = createUpload('images/profile');
const uploadCategoryImage = createUpload('images/category');
const uploadSubcategoryImage = createUpload('images/subcategory');
const uploadProductImages = createUpload('images/products'); // For multiple product images

// Exporting the upload functions
module.exports = {
  uploadProfileImage,
  uploadCategoryImage,
  uploadSubcategoryImage,
  uploadProductImages
};
