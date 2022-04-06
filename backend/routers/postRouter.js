const express = require('express');
const checkAuth = require('../middleware/check-auth');
const Post = require('../models/post');

const router = express.Router();

router.get('/', async (req, res) => {
  const pageSize = Number(req.query.pageSize);
  const currentPage = Number(req.query.currentPage);

  const postQuery = Post.find();

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  const posts = await postQuery;
  const totalPosts = await Post.countDocuments();

  res.status(200).json({
    message: 'Successfully retrieved posts',
    postCount: posts.length,
    totalPosts: totalPosts,
    posts: posts,
  });
});

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(200).json({
    message: 'Successfully retrieved post',
    post: post,
  });
});

router.post('/', checkAuth, async (req, res) => {
  const post = new Post({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
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

router.put('/:id', checkAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (!req.body.title || !req.body.imageUrl || !req.body.content) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  post.title = req.body.title;
  post.imageUrl = req.body.imageUrl;
  post.content = req.body.content;

  try {
    await post.save();

    res.status(200).json({
      message: 'Post updated successfully',
      post: post,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Post not updated',
      error: error.message,
    });
  }
});

router.delete('/:id', checkAuth, async (req, res) => {
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

module.exports = router;
