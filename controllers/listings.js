const Listing = require("../models/listing");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports.index = async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  let filter = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    filter = {
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
        { country: regex },
      ],
    };
  }

  const allListings = await Listing.find(filter);
  res.render("listings/index", { allListings, search });
};

module.exports.renderForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newlistings = new Listing(req.body.Listing);
  newlistings.owner = req.user._id;
  newlistings.image = { url, filename };
  await newlistings.save();
  req.flash("success", "new listing added!");
  res.redirect("/listings");
};

module.exports.renderEdit = async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl=data.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs", { data, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.Listing)
    throw new ExpressError(400, "Send valid data for listing");
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
  if(typeof req.file != "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = { url, filename };
  await listing.save();
  }
  req.flash("success", "listing edited!");
  res.redirect(`/listings/${id}`);
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let data = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!data) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  console.log(data);
  res.render("listings/show.ejs", { data });
};

module.exports.destoryListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("delete", " listing deleted!");
  res.redirect("/listings");
};
