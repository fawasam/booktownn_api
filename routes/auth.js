const express = require("express");
const router = express.Router();

const { signup, signin, signout } = require("../controllers/auth");

const {
  isAuth,
  isAdmin,
  requireSignin,
} = require("../middleware/authenticate");

const { userSignupValidator } = require("../utils/validator");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
