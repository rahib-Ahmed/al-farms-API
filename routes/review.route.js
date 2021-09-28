var express = require('express');
const {addReview} = require('../controllers/review.controller');
const {isUserOrder} = require('../middlewares/orders.middleware');
const {auth} = require('../middlewares/verify.middleware')
var router = express.Router();

router.post('/', auth, isUserOrder, addReview)

module.exports = router