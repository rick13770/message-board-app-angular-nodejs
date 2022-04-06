const express = require('express');
const User = require('../models/user');

const router = express.Router();

// register the user
router.post('register', async (req, res) => {
  const { email, password } = req.body;

  const user = new User({ email, password });

  try {
    await user.save();
    res.json({
      message: 'User created successfully',
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
