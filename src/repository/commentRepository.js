const Comment = require('../models/comment');

const commentRepository = {
    async getByTweet(tweetId) {
        return Comment.find({ tweet: tweetId }).sort({ createdAt: 1 });
    },

    async create(data) {
        return Comment.create(data);
    },

    async remove(id) {
        return Comment.findByIdAndDelete(id);
    },
};

module.exports = commentRepository;
