const Listing=require("./models/listing");
const Reviews = require("./models/reviews.js");
const { listingSchema,reviewSchema } = require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
 if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be looged in to create listing");
    return res.redirect("/login")
  }  
  next();
}

module.exports.savedredirctUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};
//authorization listing
module.exports.isOwned= async(req,res,next)=>{
  let {id}=req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error","you are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// listing validator
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//  review validator
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

//authorization review
module.exports.isReviewAuthor= async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review = await Reviews.findById(reviewId);
  if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error","you are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};