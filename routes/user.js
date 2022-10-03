const express = require("express");
const router = express.Router();

const {
  userById,
  getUserById,
  updateUserById,
} = require("../controllers/user");
const {
  requireSignin,
  isAuth,
  isAdmin,
} = require("../middleware/authenticate");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.get("/user/:userId", requireSignin, isAuth, getUserById);
router.put("/user/:userId", requireSignin, isAuth, updateUserById);

router.param("userId", userById);

module.exports = router;
