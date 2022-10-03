const User = require("../models/User");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user)
      return res.status(400).json({ success: false, error: "User not found" });
    req.profile = user;
    next();
  });
};

// @desc      get userById
// @route     GET /api/v1/user/:userById
// @access    Private

exports.getUserById = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json({
    success: true,
    data: req.profile,
  });
};

// @desc      update userById
// @route     PUT /api/v1/user/:userById
// @access    Private

exports.updateUserById = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: "Your not authorized to perform this action",
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      return res.json({
        success: true,
        data: user,
      });
    }
  );
};
