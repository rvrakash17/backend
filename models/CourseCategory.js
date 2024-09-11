// models/CourseCategory.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for CourseCategory
const CourseCategorySchema = new Schema({
    courseCategoryName: {
        type: String,
        required: true,
        unique: true
    },
    courseCategoryDescription: {
        type: String,
        required: false
    },
    courseCategoryImage: {
        type: String,
        required: false // Path to the image file
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

// Create the model from the schema
const CourseCategory = mongoose.model('CourseCategory', CourseCategorySchema);

module.exports = CourseCategory;
