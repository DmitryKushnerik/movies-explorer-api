const jwt = require('jsonwebtoken');
const AuthorisationError = require('../errors/AuthorisationError');
const { messageNeedAuthorisation } = require('../utils/messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthorisationError(messageNeedAuthorisation);
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthorisationError(messageNeedAuthorisation);
  }

  req.user = payload;
  next();
};
