const Reviews = require("../models/reviews.js");
const Listing = require("../models/listing.js");




module.exports.addReview=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) throw new ExpressError(404, "Listing not found");
  if (!req.body.review) throw new ExpressError(400, "Review data is missing");

  const newReview = new Reviews(req.body.review);
  newReview.author=req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
   req.flash("success","review added!");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Reviews.findByIdAndDelete(reviewId);
  req.flash("success","review deleted!");
  res.redirect(`/listings/${id}`);
}