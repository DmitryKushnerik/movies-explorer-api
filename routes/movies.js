const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUserMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { urlTemplate } = require('../utils/validation');

router.get('/', getUserMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().regex(/^\d{4}$/),
    description: Joi.string().required(),
    image: Joi.string().required().regex(urlTemplate),
    trailerLink: Joi.string().required().regex(urlTemplate),
    thumbnail: Joi.string().required().regex(urlTemplate),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
