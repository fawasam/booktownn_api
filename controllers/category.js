const Category = require("../models/Category");
const jwt = require("jsonwebtoken"); // generate signed token
const errorHandler = require("../middleware/dbErrorHandler");

// @desc      create category
// @route     POST /api/v1/category/create
// @access    Public

exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err)
      return res.status(400).json({
        success: false,
        error: "Category already exists",
      });

    res.status(201).json({
      success: true,
      data: category,
    });
  });
};

// @desc      get categoryById
// @route     POST /api/v1/category/:categoryById
// @access    Public

exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err)
      return res.status(400).json({
        success: false,
        error: "Category is does not exist",
      });

    req.category = category;
    next();
  });
};

// @desc      read categoryById
// @route     POST /api/v1/category/:categoryById
// @access    Public

exports.read = (req, res) => {
  res.status(200).json({
    success: true,
    data: req.category,
  });
};

// @desc      update categoryById
// @route     POST /api/v1/category/:categoryById
// @access    Public

exports.update = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, data) => {
    if (err)
      return res.status(400).json({
        success: false,
        error: "Category updation failed",
      });
    res.status(200).json({
      success: true,
      data: req.data,
    });
  });
};

// @desc      remove categoryById
// @route     POST /api/v1/category/:categoryById
// @access    Public

exports.remove = (req, res) => {
  const category = req.category;

  category.remove((err, data) => {
    if (err)
      return res.status(400).json({
        success: false,
        error: "Category updation failed",
        message: errorHandler(err),
      });
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  });
};

// @desc      lis all category
// @route     POST /api/v1/category/:categoryById
// @access    Public

exports.list = (req, res) => {
  Category.find().exec((err, data) => {
    if (err)
      return res.status(400).json({
        success: false,
        error: "Category updation failed",
        message: errorHandler(err),
      });
    res.status(200).json({
      success: true,
      data: data,
    });
  });
};
