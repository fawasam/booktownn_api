const Product = require("../models/Product");
const errorHandler = require("../middleware/dbErrorHandler");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

// @desc      get product by id
// @route     POST /api/v1/product/:productById
// @access    Public

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product)
      return res
        .status(400)
        .json({ success: false, error: "Product not found" });
    req.product = product;
    next();
  });
};

// @desc      get product by id
// @route     POST /api/v1/product/:productById
// @access    Public

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json({
    success: true,
    data: req.product,
  });
};

// @desc      create product
// @route     POST /api/v1/product/create
// @access    Public

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err)
      return res
        .status(400)
        .json({ success: false, error: "Image could not be uploaded" });

    //check for all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }
    let product = new Product(fields);

    // 1kb =1000
    // 1mb =1000000
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          success: false,
          error: "Image should be less than 1mb in size",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
      // console.log(product.photo);
    }

    product.save((err, result) => {
      if (err)
        return res.status(400).json({
          success: false,
          error: err,
          message: errorHandler(err),
        });

      res.status(201).json({
        success: true,
        data: result,
      });
    });
  });
};

// @desc      update product by id
// @route     PUT /api/v1/product/:productById/:userId
// @access    Public
exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    // console.log(files, fields);
    if (err)
      return res
        .status(400)
        .json({ success: false, error: "Image could not be uploaded" });

    //check for all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }
    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          success: false,
          error: "Image should be less than 1mb in size",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
      // console.log(product.photo);
    }
    product.save((err, result) => {
      if (err)
        return res.status(400).json({
          success: false,
          // error: err.errors.name.message,
          message: errorHandler(err),
        });

      res.status(201).json({
        success: true,
        data: result,
      });
    });
  });
};

// @desc      delete product by id
// @route     DELETE /api/v1/product/:productById/:userId
// @access    Public
exports.remove = (req, res) => {
  req.product.photo = undefined;
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err)
      return res.status(400).json({
        success: false,
        error: err.errors.name.message,
        message: errorHandler(err),
      });
    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  });
};
/*

sell and arrival

by sell = /products?sortBy=sold&order=desc&limit=4
by arrival = /products?sortBy=createdAt&order=desc&limit=4
if no params are sent, then all products are returned
*/

// @desc      list product by order/sortBy/limit by default list all products
// @route     GET /api/v1/product
// @access    Public

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err)
        return res.status(400).json({
          success: false,
          error: "Product not found",
        });
      return res.json({
        success: true,
        data: products,
      });
    });
};

/*
 it will find the products based on the req product category
 other products that has the same category will be returned
 and also dont show the current product
*/

// @desc      Get related products from current product category
// @route     GET /api/v1/products/related/:productId
// @access    Public

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err)
        return res.status(400).json({
          success: false,
          error: "Product not found",
        });
      return res.json({
        success: true,
        data: products,
      });
    });
};

// @desc      Get List categories of products
// @route     GET /api/v1/products/categories
// @access    Public

exports.listCategories = (req, res) => {
  Product.distinct("category", {}, (err, products) => {
    if (err)
      return res.status(400).json({
        success: false,
        error: "Categories not found",
      });
    return res.json({
      success: true,
      data: products,
    });
  });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

// route - make sure its post

// @desc      Get List by search
// @route     GET /api/v1/products/by/search
// @access    Public

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        success: true,
        size: data.length,
        data: data,
      });
    });
};

// @desc      Get product photo
// @route     GET /api/v1/products/photo/:productId
// @access    Public

exports.getPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    // console.log(req.product);
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
