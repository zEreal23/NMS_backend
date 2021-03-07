const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const Promotion = require("../models/promotion");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.promotionById = (req, res, next, id) => {
    Promotion.findById(id).exec((err, promotion) => {
    if (err || !promotion) {
      return res.status(400).json({
        error: "Promotion not found",
      });
    }
    req.promotion = promotion;
    next();
  });
};

exports.read = (req, res) => {
  req.promotion.photo = undefined;
  return res.json(req.promotion);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be upload",
      });
    }
    // check for all fields
    const { name, dc } = fields;
    if (!name || !dc) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let promotion = new Promotion(fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      promotion.photo.data = fs.readFileSync(files.photo.path);
      promotion.photo.contentType = files.photo.type;
    }

    promotion.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let promotion = req.promotion;
  promotion.remove((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Promotion deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    // check for all fields
    /*const { name, price, category, quantity } = fields;
    if (!name || !price || !category || !quantity) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }*/

    let promotion = req.promotion;
    promotion = _.extend(promotion, fields);

    // 1kb = 1000
    // 1mb = 1000000

    if (files.photo) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      promotion.photo.data = fs.readFileSync(files.photo.path);
      promotion.photo.contentType = files.photo.type;
    }

    promotion.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */
exports.list = (req, res) => {

  Promotion.find()
      .exec((err, promotions) => {
          if (err) {
              return res.status(400).json({
                  error: 'Promotions not found'
              });
          }
          res.json(promotions);
      });
};

exports.photo = (req, res, next) => {
    if (req.promotion.photo.data) {
        res.set('Content-Type', req.promotion.photo.contentType);
        return res.send(req.promotion.photo.data);
    }
    next();
  };