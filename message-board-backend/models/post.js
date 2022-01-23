const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title must be less than 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters'],
    maxlength: [1000, 'Content must be less than 1000 characters'],
  },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
