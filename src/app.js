const express = require('express');
const cors = require('cors');
require('dotenv').config();

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Good Hamburger API is running' });
}
);

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

module.exports = app;