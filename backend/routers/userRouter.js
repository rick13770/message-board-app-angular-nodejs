const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const user = new User({
    email: email,
    password: await bcrypt.hash(password, 10),
  });

  try {
    await user.save();
    res.status(201).json({
      message: 'User created successfully',
      id: user._id,
      email: user.email,
      token: generateToken(user),
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
      id: user._id,
      email: user.email,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

module.exports = router;
