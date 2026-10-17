const User = require('../models/user');
const Follow = require('../models/follow');

const userRepository = {
    async getAll() {
        return User.find().sort({ createdAt: -1 });
    },

    async getById(id) {
        return User.findById(id);
    },

    async getByUsername(username) {
        return User.findOne({ username });
    },

    async create(data) {
        return User.create(data);
    },

    async follow(followerId, followingId) {
        if (followerId.equals(followingId)) {
            throw new Error('cannot follow yourself');
        }

        const followingUser = await User.findById(followingId);
        if (!followingUser) {
            throw new Error('user not found');
        }

        const follow = await Follow.create({ follower: followerId, following: followingId });
        return follow.populate('follower following');
    },

    async unfollow(followerId, followingId) {
        return Follow.findOneAndDelete({ follower: followerId, following: followingId });
    },

    async getFollowers(userId) {
        const follows = await Follow.find({ following: userId })
            .populate('follower')
            .sort({ createdAt: -1 });
        return follows.map((f) => f.follower);
    },

    async getFollowing(userId) {
        const follows = await Follow.find({ follower: userId })
            .populate('following')
            .sort({ createdAt: -1 });
        return follows.map((f) => f.following);
    },
};

module.exports = userRepository;
