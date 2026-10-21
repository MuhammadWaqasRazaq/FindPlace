const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapasync = require("../utils/wrapasync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");



// Add review
router.post("/",isLoggedIn, validateReview, wrapasync(reviewController.addReview));

// Delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapasync(reviewController.destroyReview));

module.exports = router;
