const express = require('express');

const app = express();

app.use(express.json());

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

module.exports = app;
