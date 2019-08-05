const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const isEmail = require('isemail');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    validate: [isEmail.validate, 'Invalid email address'],
  },
  password: {
    type: String,
    validate: [p => p.length > 7, 'Password must be at least 8 characters long'],
  },
});

userSchema.pre('save', function encryptPassword(next) {
  if (!this.isModified('password')) {
    next();
  } else {
    bcrypt.hash(this.password, 10, (error, hash) => {
      if (error) {
        next(error);
      } else {
        this.password = hash;
        next();
      }
    });
  }
});

userSchema.methods.sanitise = function sanitise(user) {
  const { password, ...noPassword } = user.toObject();
  return noPassword;
};

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
