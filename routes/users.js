const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  updateUserInfo, getUserInfo,
} = require('../controllers/users');
const { emailTemplate } = require('../utils/validation');

router.get('/me/', getUserInfo);

router.patch('/me/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().regex(emailTemplate),
  }),
}), updateUserInfo);

module.exports = router;
