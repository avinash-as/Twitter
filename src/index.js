const express = require('express');
const connect = require('./config/database');
const tweetRepository = require('./repository/tweetRepository');
const commentRepository = require('./repository/commentRepository');
const userRepository = require('./repository/userRepository');

const app = express();
app.use(express.json());

// Get all tweets
app.get('/tweets', async (req, res) => {
    try {
        const tweets = await tweetRepository.getAll();
        res.json(tweets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a tweet
app.post('/tweets', async (req, res) => {
    try {
        const { content, author } = req.body;
        if (!content || !author) {
            return res.status(400).json({ error: 'content and author are required' });
        }
        const tweet = await tweetRepository.create({ content, author });
        res.status(201).json(tweet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Like / unlike a tweet
app.post('/tweets/:id/like', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: 'username is required' });
        }
        const tweet = await tweetRepository.like(req.params.id, username);
        if (!tweet) {
            return res.status(404).json({ error: 'tweet not found' });
        }
        res.json(tweet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a tweet (and its comments)
app.delete('/tweets/:id', async (req, res) => {
    try {
        const tweet = await tweetRepository.remove(req.params.id);
        if (!tweet) {
            return res.status(404).json({ error: 'tweet not found' });
        }
        res.json({ message: 'tweet deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get comments for a tweet
app.get('/tweets/:id/comments', async (req, res) => {
    try {
        const comments = await commentRepository.getByTweet(req.params.id);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a comment to a tweet
app.post('/tweets/:id/comments', async (req, res) => {
    try {
        const { content, author } = req.body;
        if (!content || !author) {
            return res.status(400).json({ error: 'content and author are required' });
        }
        const comment = await commentRepository.create({
            content,
            author,
            tweet: req.params.id,
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a comment
app.delete('/comments/:id', async (req, res) => {
    try {
        const comment = await commentRepository.remove(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'comment not found' });
        }
        res.json({ message: 'comment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a user
app.post('/users', async (req, res) => {
    try {
        const { username, name } = req.body;
        if (!username || !name) {
            return res.status(400).json({ error: 'username and name are required' });
        }
        const existing = await userRepository.getByUsername(username);
        if (existing) {
            return res.status(409).json({ error: 'username already taken' });
        }
        const user = await userRepository.create({ username, name });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await userRepository.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Follow a user
app.post('/users/:userId/follow', async (req, res) => {
    try {
        const { followerId } = req.body;
        if (!followerId) {
            return res.status(400).json({ error: 'followerId is required' });
        }
        const follow = await userRepository.follow(followerId, req.params.userId);
        res.status(201).json(follow);
    } catch (error) {
        if (error.message === 'cannot follow yourself') {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === 'user not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
});

// Unfollow a user
app.delete('/users/:userId/unfollow', async (req, res) => {
    try {
        const { followerId } = req.body;
        if (!followerId) {
            return res.status(400).json({ error: 'followerId is required' });
        }
        const follow = await userRepository.unfollow(followerId, req.params.userId);
        if (!follow) {
            return res.status(404).json({ error: 'not following this user' });
        }
        res.json({ message: 'unfollowed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get followers of a user
app.get('/users/:userId/followers', async (req, res) => {
    try {
        const followers = await userRepository.getFollowers(req.params.userId);
        res.json(followers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get users a user is following
app.get('/users/:userId/following', async (req, res) => {
    try {
        const following = await userRepository.getFollowing(req.params.userId);
        res.json(following);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, async () => {
    console.log('Server is Started');
    await connect();
    console.log('Mongo db connected');
});
