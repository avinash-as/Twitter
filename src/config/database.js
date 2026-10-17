const mongoose = require('mongoose');

/**
 * Connect to MongoDB using mongoose.
 * Falls back to a local twitter database when MONGODB_URI is not set.
 */
async function connect() {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/twitter';
    await mongoose.connect(uri);
    console.log('Mongo db connected');
}

module.exports = { connect };
