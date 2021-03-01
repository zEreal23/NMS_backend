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
    return res.json(req.profile);
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

exports.update = async(req, res) => {
  const { name } = req.body;
  if(!name) {
      return res.status(400).json({
          error: 'Bad Request'
      });
  }
  
 const data = await User.findOneAndUpdate({ _id: req.profile._id }, {$set:{name:name}})
  console.log(data)
  return res.status(200).json(data)
}

exports.remove = (req, res) => {
    let user = req.profile;
    user.remove((err, data) => {
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
