
const express = require("express");
const router = express.Router();

const {
  create,
  promotionById,
  read,
  remove,
  update,
  list,
  photo
} = require("../controllers/promotion");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");


router.get("/promotion/:promotionId", read);
router.post("/promotion/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
  "/promotion/:promotionId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/promotion/:promotionId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.get("/promotions", list);
router.get("/promotion/photo/:promotionId", photo);

router.param("userId", userById);
router.param("promotionId", promotionById);

module.exports = router;