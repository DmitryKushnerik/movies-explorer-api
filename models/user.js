const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const { AuthorisationError } = require('../errors/AuthorisationError');
const { emailTemplate } = require('../utils/validation');
const { messageWrongCredentials } = require('../utils/messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return emailTemplate.test(v);
      },
      message: (props) => `${props.value} не является email`,
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

function findUserByCredentialsHandler(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorisationError(messageWrongCredentials));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorisationError(messageWrongCredentials));
          }

          return user;
        });
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentialsHandler;

module.exports = mongoose.model('user', userSchema);
