const router = require('express').Router();
const {
  getUserMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { validatorCreateMovie, validatorDeleteMovie } = require('../utils/validation');

router.get('/', getUserMovies);

router.post('/', validatorCreateMovie, createMovie);

router.delete('/:_id', validatorDeleteMovie, deleteMovie);

module.exports = router;
