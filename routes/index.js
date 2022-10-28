const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { messageUrlNotFound } = require('../utils/messages');
const { validatorSignup, validatorSignin } = require('../utils/validation');

// Краш-тест (удалить после ревью)
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Регистрация нового пользователя
router.post('/signup', validatorSignup, createUser);

// Вход в систему
router.post('/signin', validatorSignin, login);

// Выход из системы
router.post('/signout', auth, logout);

// Внешние роутеры
router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

// Неправильные URL
router.use('*', auth, (req, res, next) => {
  const err = new NotFoundError(messageUrlNotFound);
  next(err);
});

module.exports = router;
