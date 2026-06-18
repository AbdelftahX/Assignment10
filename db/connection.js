const mongoose = require('mongoose');

const dbConnection = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/assignment10')
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.log('Database connection error', err));
}

module.exports = dbConnection;