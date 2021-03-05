const T = require("../models/t");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.tById = (req, res, next, id) => {
  T.findById(id).exec((err, t) => {
    if (err || !t) {
      return res.status(400).json({
        error: "Table does not exist",
      });
    }
    req.t = t;
    next();
  });
};

exports.create = (req, res) => {
  const t = new T(req.body);
  console.log(t);
  t.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

exports.read = (req, res) => {
  return res.json(req.t);
};

exports.update = (req, res) => {
  console.log("req.body", req.body.name);
  console.log("category update param", req.params.tId);

  const t = req.t;
  t.name = req.body.name;
  t.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  const t = req.t;
  t.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Table deleted",
    });
  });
};

exports.list = (req, res) => {
  T.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};
