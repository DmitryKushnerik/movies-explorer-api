const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');
const Movie = require('../models/movie');
const {
  messageWrongMovieData,
  messageMovieNotFound,
  messageForbidden,
  messageWrongMovieId,
} = require('../utils/messages');

// Добавить новый фильм
module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(messageWrongMovieData));
      }
      return next(err);
    });
};

// Получить все фильмы пользователя
module.exports.getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};

// Удалить фильм
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (movie === null) {
        return next(new NotFoundError(messageMovieNotFound));
      }
      if (String(movie.owner) !== String(req.user._id)) {
        return next(new ForbiddenError(messageForbidden));
      }

      return Movie.findByIdAndRemove(req.params._id)
        .then((delMovie) => res.send(delMovie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(ValidationError(messageWrongMovieId));
      }
      return next(err);
    });
};
