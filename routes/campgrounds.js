const express = require("express");
const router = express.Router();
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require("../utils/catchAsync");

const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../middleware/auth");

const {
  deleteCampground,
  postEdit,
  viewEdit,
  index,
  createCampground,
  postCampground,
  viewCampground,
} = require("../controllers/campground");

router.route('/')
.get(isLoggedIn, catchAsync(index))
.post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(postCampground));

router.get("/new", isLoggedIn, createCampground);
router.route('/:id')
.get(catchAsync(viewCampground))
.put(upload.array('image'),validateCampground, isAuthor, catchAsync(postEdit))
.delete(isAuthor, catchAsync(deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(viewEdit));

module.exports = router;
