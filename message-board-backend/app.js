const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Post = require('./models/post');

dotenv.config();

const app = express();

const MONGODB_URL =
  process.env.MONGODB_URL ||
  'mongodb://localhost:27017/message-board-app-angular-nodejs';

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );

  next();
});

app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: 'desc' }).limit(10);

  res.status(200).json({
    message: 'Successfully retrieved posts',
    posts: posts,
  });
});

app.get('/api/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(200).json({
    message: 'Successfully retrieved post',
    post: post,
  });
});

app.post('/api/posts', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    await post.save();

    res.status(201).json({
      message: 'Post added successfully',
      post: post,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Post not added',
      error: error.message,
    });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    await post.delete();

    res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Post not deleted',
      error: error.message,
    });
  }
});

module.exports = app;
