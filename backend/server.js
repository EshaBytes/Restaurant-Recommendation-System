const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

dotenv.config();

const app = express();

(async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
})();

app.use(cors());
app.use(express.json());
app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use('/uploads', express.static('uploads'));

app.get('/api/test', (req, res) =>
  res.json({ success: true, message: 'API is working!' })
);

app.get('/', (req, res) =>
  res.json({ message: '🍽️ Restaurant Recommendation API is live!' })
);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ml', require('./routes/mlRecommendations')); 
app.use('/api/similarity', require('./routes/similarity')); 


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);