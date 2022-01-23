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

const DUMMY_POSTS = [
  {
    id: 123,
    title: 'First Post',
    content: 'This is the first post',
  },
  {
    id: 234,
    title: 'Second Post',
    content: 'This is the second post',
  },
  {
    id: 345,
    title: 'Third Post',
    content: 'This is the third post',
  },
];

app.get('/api/posts', (req, res) => {
  res.status(200).json({
    message: 'Successfully retrieved posts',
    posts: DUMMY_POSTS,
  });
});

app.post('/api/posts', (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  res.status(201).json({
    message: 'Post added successfully',
    post: post,
  });
});

module.exports = app;
