const Tables = require("../models/table");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.talbeById = (req, res, next, id) => {
    Tables.findById(id).exec((err, table) => {
    if (err || !table) {
      return res.status(400).json({
        error: "table not found",
      });
    }
    req.table = table;
    next();
  });
};

exports.read = (req, res) => {
  return res.json(req.table);
};

exports.list = (req, res) => {
    Tables.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Dont have any table",
      });
    }
    res.json(data);
  });
};

exports.create = (req, res) => {
  const tables = new Tables(req.body);
  console.log(tables)
  if (!tables) {
    return res.status(400).json({
      error: "Bad Request",
    });
  }
  tables.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

exports.update = async (req, res) => {
  const { noTable } = req.body;
  if (!noTable) {
    return res.status(400).json({
      error: "Bad Request",
    });
  }
  const data = await Tables.findOneAndUpdate(
    { _id: req.table._id },
    { $set: { noTable: noTable } }
  );
  console.log(data);
  return res.status(200).json(data);
};

exports.remove = (req, res) => {
  let table = req.table;
  table.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Table deleted successfully",
    });
  });
};
