const express = require('express');
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavorite
} = require('../controllers/favorites');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.use(protect);

router.route('/')
  .get(getFavorites);

router.route('/:homestayId')
  .post(addToFavorites)
  .delete(removeFromFavorites);

router.route('/:homestayId/check')
  .get(checkFavorite);

module.exports = router;