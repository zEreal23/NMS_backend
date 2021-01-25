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
router.get("/user/:userOneId" ,read)
router.put("/user/:userEditId/:userId", requireSignin, isAuth, isAdmin, update)
router.delete("/user/:userDelId/:userId", requireSignin, isAuth, isAdmin, remove)

module.exports = router;
