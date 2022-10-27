const router = require('express').Router();
const {
  updateUserInfo, getUserInfo,
} = require('../controllers/users');
const { validatorUpdateUser } = require('../utils/validation');

router.get('/me/', getUserInfo);

router.patch('/me/', validatorUpdateUser, updateUserInfo);

module.exports = router;
