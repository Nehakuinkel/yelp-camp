const Campground = require("../models/campgrounds");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds: campgrounds });
};

module.exports.createCampground = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.postCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.image = req.files.map(f=>({url:f.path,filename:f.filename}))
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new Campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.viewCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot Find Campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.postEdit = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const img = req.files.map(f=>({url:f.path,filename:f.filename}))
  campground.image.push(...img);
  await campground.save();
  req.flash("success", "Successfully Updated Campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.viewEdit = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground Deleted Successfully");
  res.redirect("/campgrounds");
};
