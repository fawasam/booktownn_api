const express = require("express");
const router = express.Router();

const {
  create,
  categoryById,
  read,
  update,
  remove,
  list,
} = require("../controllers/category");
const { userById } = require("../controllers/user");

const {
  isAuth,
  isAdmin,
  requireSignin,
} = require("../middleware/authenticate");

router.get("/category/:categoryId", read);
router.get("/categories", list);
router.post("/category/create/:userId", requireSignin, isAuth, create);
router.put(
  "/category/:categoryId /:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.delete(
  "/category/:categoryId /:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;
