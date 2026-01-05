require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const authRoutes = require('./routes/auth');
const superAdminRoutes = require('./routes/superAdmin');
const hotelAdminRoutes = require('./routes/hotelAdmin');
const userRoutes = require('./routes/user');
const bookingRoutes = require('./routes/bookings');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/hoteladmin', hotelAdminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bookings', bookingRoutes);

// Sync Database & start server
sequelize.sync({ alter: true }) // use { force: true } only for complete reset
  .then(() => {
    console.log('SQLite Database connected & synced');
    app.listen(process.env.PORT || 5000, () => console.log('Server running on port ' + (process.env.PORT || 5000)));
  })
  .catch(err => console.log('Database connection error:', err));
