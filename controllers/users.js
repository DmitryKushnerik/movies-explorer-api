const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UserExistsError = require('../errors/UserExistsError');
const {
  messageWrongUserData,
  messageDoubleEmail,
  messageUserNotFound,
  messageWrongUserId,
  messageLogIn,
  messageLogOut,
} = require('../utils/messages');

// Создать нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const result = {
        _id: user._id, name: user.name, email: user.email,
      };
      return res.send(result);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(messageWrongUserData));
      }
      if (err.code === 11000) {
        return next(new UserExistsError(messageDoubleEmail));
      }
      return next(err);
    });
};

// Получить информацию о залогиненном пользователе
module.exports.getUserInfo = (req, res, next) => {
  const userID = req.user._id;
  User.findById(userID)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(messageUserNotFound));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError(messageWrongUserId));
      }
      return next(err);
    });
};

// Обновить информацию о пользователе
module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(messageUserNotFound));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(messageWrongUserData));
      }
      if (err.code === 11000) {
        return next(new UserExistsError(messageDoubleEmail));
      }
      return next(err);
    });
};

// Вход в систему
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: messageLogIn });
    })
    .catch(next);
};

// Выход из системы
module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: messageLogOut });
};
