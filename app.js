// [Dependencies]
const express = require('express');
const mongoose = require('mongoose');

// [DB]
mongoose
    .connect('mongodb://localhost:27017/tdd-dev-prac', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => { console.log('MongoDB Connected') })
    .catch((error) => { console.log(error) });

const app = express();
const productRoutes = require('./routes');

app.use(express.json());
app.use('/api/products', productRoutes);
app.use((error, req, res, next) => {
    // console.log(error.message);
    res
        .status(500)
        .json({ message: error.message })
});

module.exports = app;