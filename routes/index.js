const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

// Краш-тест (удалить после ревью)
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Регистрация нового пользователя
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// Вход в систему
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// Выход из системы
router.post('/signout', logout);

// Внешние роутеры
router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

// Неправильные URL
router.use('*', auth, (req, res, next) => {
  const err = new NotFoundError('Запрошенный URL не найден');
  next(err);
});

module.exports = router;
