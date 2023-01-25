const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review')
const Campground =require('../models/campgrounds');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware/auth')

router.post('/' ,isLoggedIn, validateReview , catchAsync(async(req,res)=> {
    const campground =  await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Your reviews are added successfully")
    res.redirect(`/campgrounds/${campground._id}`);
 }))
 
 router.delete('/:reviewId', isLoggedIn,isReviewAuthor,catchAsync(async(req,res) => {
     const {id, reviewId} = req.params;
     console.log(req.params);
     await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
     await Review.findByIdAndDelete(reviewId);
     res.redirect(`/campgrounds/${id}`);
 }))


module.exports = router;
