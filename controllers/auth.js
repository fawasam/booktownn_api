const User = require("../models/User");
const jwt = require("jsonwebtoken"); // generate signed token
const errorHandler = require("../middleware/dbErrorHandler");

// @desc      Register user
// @route     POST /api/v1/auth/signup
// @access    Public

exports.signup = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err)
      return res.status(400).json({ success: false, error: errorHandler(err) });

    user.salt = undefined;
    user.hashed_password = undefined;
    res.status(201).json({
      success: true,
      data: user,
    });
  });
};

// @desc      Login user
// @route     POST /api/v1/auth/signin
// @access    Public

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user)
      return res.status(400).json({
        success: false,
        error: "User with that email does not exist. Please signup",
      });

    if (!user.authenticate(password)) {
      return res.status(401).json({
        success: false,
        error: "Email and password do not match",
      });
    }

    //token generate
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //asign it into cookie
    res.cookie("user", token, { expire: new Date() + 9999 });
    const { _id, name, email, role } = user;
    return res.status(200).json({
      success: true,
      token,
      user: { _id, name, email, role },
    });
  });
};

// @desc      Logout user
// @route     POST /api/v1/auth/signout
// @access    Private

exports.signout = (req, res) => {
  res.clearCookie("user");
  res.status(200).json({
    success: true,
    message: "Successfully logged out",
  });
};
