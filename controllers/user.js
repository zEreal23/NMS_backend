const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
    return res.json(req.user);
};

exports.list = (req, res) => {
  User.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  console.log("req.body", req.body.name);
  console.log("category update param", req.params.userId);

  const user = req.user;
  user.name = req.body.name;
  user.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
    let user = req.user;
    user.remove((err) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json({
        message: "User deleted successfully",
      });
    });
  };
