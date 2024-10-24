const mongoose = require('mongoose');
// require('dotenv').config();

mongoose.connect(
    process.env.MONGO_URI,
    // MONGO_URI
)

const db = mongoose.connection;

db.on('error', (error) => {
    console.log('Database not connected due to :',error);
});

db.once('open',() => {
    console.log('Connected to database');
});

module.exports = {mongoose};