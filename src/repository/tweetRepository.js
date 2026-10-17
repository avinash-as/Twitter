const Tweet = require('../models/tweet');
const Comment = require('../models/comment');

const tweetRepository = {
    async getAll() {
        return Tweet.find().sort({ createdAt: -1 });
    },

    async getById(id) {
        return Tweet.findById(id);
    },

    async create(data) {
        return Tweet.create(data);
    },

    async like(id, username) {
        const tweet = await Tweet.findById(id);
        if (!tweet) return null;

        if (tweet.likedBy.includes(username)) {
            // Unlike
            tweet.likedBy = tweet.likedBy.filter((u) => u !== username);
            tweet.likes = Math.max(0, tweet.likes - 1);
        } else {
            // Like
            tweet.likedBy.push(username);
            tweet.likes += 1;
        }

        await tweet.save();
        return tweet;
    },

    async remove(id) {
        await Comment.deleteMany({ tweet: id });
        return Tweet.findByIdAndDelete(id);
    },
};

module.exports = tweetRepository;
