const express = require("express");
param = require("express-params");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById , list , read , update , remove} = require("../controllers/user");

router.param("userId", userById);

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.get("/users" , list);
router.get("/user/:userId" ,requireSignin, isAuth, read)
router.put("/user/:userId", requireSignin, isAuth, update)
router.delete("/user/:userId", requireSignin, isAuth,  remove)

module.exports = router;
