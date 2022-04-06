const bcrypt = require('bcryptjs');
const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const user = new User({
    email: email,
    password: await bcrypt.hash(password, 10),
  });

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    // const token = await user.generateAuthToken();
    res.json({
      message: 'User logged in successfully',
      // token: token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
