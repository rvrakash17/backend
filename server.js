require('dotenv').config(); 

const express = require('express');
const connectDB = require('./config/database');


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes'); 
const app = express();

connectDB();

app.use(express.json());

app.use('/images/profile', express.static('images/profile'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/address', addressRoutes);

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
