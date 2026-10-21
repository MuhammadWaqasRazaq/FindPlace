const Joi = require("joi");


module.exports.listingSchema = Joi.object({
    Listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("", null),

    }).required(),
});



module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
      "any.required": "Rating is required",
      "number.base": "Rating must be a number",
    }),
    comment: Joi.string().min(1).required().messages({
      "any.required": "Comment is required",
      "string.empty": "Comment cannot be empty"
    }),
  }).required().messages({
    "any.required": "Review data is required"
  }),
});
