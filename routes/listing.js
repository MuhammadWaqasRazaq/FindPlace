
const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwned, validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage })




router
.route("/")
.get(wrapasync(listingController.index))// index route 
.post(isLoggedIn,upload.single("Listing[image]"),validateListing,wrapasync(listingController.createListing));// create listing

// New Route
router.get("/new", isLoggedIn,listingController.renderForm);


router.route("/:id")
.get(wrapasync(listingController.showListing))// show route
.put(isLoggedIn,upload.single("Listing[image]"),isOwned,wrapasync(listingController.updateListing))
// update route
.delete(isLoggedIn,isOwned,wrapasync(listingController.destoryListing));// delete route


// edit route
router.get("/:id/edit",isLoggedIn,isOwned,wrapasync(listingController.renderEdit));

module.exports = router;
