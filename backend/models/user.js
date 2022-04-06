const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('User', UserSchema);

module.exports = User;
