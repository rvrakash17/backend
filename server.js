require('dotenv').config(); 

const express = require('express');
const connectDB = require('./config/database');

const cors = require('cors');
const { json, urlencoded } = express;

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes'); 
const subcategoryRoutes = require('./routes/subcategoryRoutes'); 
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const orderRoutes = require('./routes/orderRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');

const courseRoutes = require('./routes/courseRoutes');
const courseCategoryRoutes = require('./routes/courseCategoryRoutes');

const app = express();

connectDB();

app.use(cors()); // Enable CORS
app.use(json()); // Parse JSON bodies
app.use(urlencoded({ extended: true }));
app.use(express.json());

app.use('/images/profile', express.static('images/profile'));
app.use('/images/category', express.static('images/category'));
app.use('/images/subcategory', express.static('images/subcategory'));
app.use('/images/products', express.static('images/products'));
app.use('/images/coursecategory', express.static('images/coursecategory'));
app.use('/images/course', express.static('images/course'));
app.use('/images/videos', express.static('images/videos'));
app.use('/images/pdfs', express.static('images/pdfs'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategory', subcategoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/course-categories', courseCategoryRoutes);


app.get('/', async (req, res) => {
  res.json("Api is Running");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/`);
});
