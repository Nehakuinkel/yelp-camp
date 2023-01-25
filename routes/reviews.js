const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review')
const { createReview, deleteReview } = require('../controllers/reviews')
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware/auth')

router.post('/' ,isLoggedIn, validateReview , catchAsync(createReview))
router.delete('/:reviewId', isLoggedIn,isReviewAuthor,catchAsync(deleteReview))


module.exports = router;
