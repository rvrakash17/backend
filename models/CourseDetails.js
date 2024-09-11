// models/CourseDetails.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for CourseDetails
const CourseDetailsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'CourseCategory', // Reference to the CourseCategory model
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    courseImage: {
        type: String,
        required: false // Path to the course image file
    },
    videos: [{
        title: {
            type: String,
            required: false
        },
        url: {
            type: String,
            required: true // URL to the video file
        }
    }],
    pdfDocuments: [{
        title: {
            type: String,
            required: false
        },
        url: {
            type: String,
            required: true // URL to the PDF file
        }
    }]
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

// Create the model from the schema
const CourseDetails = mongoose.model('CourseDetails', CourseDetailsSchema);

module.exports = CourseDetails;
