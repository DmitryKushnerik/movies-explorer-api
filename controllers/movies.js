const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');
const Movie = require('../models/movie');

// Добавить новый фильм
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN,
    thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании записи'));
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
        return next(new NotFoundError('Запись с указанным _id не найдена'));
      }
      if (String(movie.owner) !== String(req.user._id)) {
        return next(new ForbiddenError('У пользователя нет прав на это действие'));
      }

      return Movie.findByIdAndRemove(req.params._id)
        .then((delMovie) => res.send(delMovie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(ValidationError('Передан некорректный _id записи'));
      }
      return next(err);
    });
};
