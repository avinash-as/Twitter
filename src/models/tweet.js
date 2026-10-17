const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 280,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        likedBy: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Tweet', tweetSchema);
