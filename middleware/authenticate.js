const { expressjwt } = require("express-jwt"); //for authorization check

// @desc      jwt required to route

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

// @desc      Authenticated user

exports.isAuth = (req, res, next) => {
  // console.log(req);
  let user =
    req.profile && req.auth && req.profile._id.toString() === req.auth._id;

  if (!user) {
    return res.status(403).json({ success: false, error: "Access denied" });
  }
  next();
};

// @desc      Authenticated Admin

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res
      .status(403)
      .json({ success: false, error: "Admin resource! Access denied" });
  }
  next();
};
