const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandler');
const {clearImageByFilePath} = require('../helpers/file');

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: 'Product not found',
            });
        }
        req.product = product;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.product);
};

exports.create = async (req, res) => {
    try {
        const {name, price, category, photo} = req.body;
        if (!name || !price || !category || !photo) {
            return res.status(400).json({
                error: 'All fields are required',
            });
        }

        const isSimilar = await Product.findOne({name: name});
        if (!!isSimilar) {
            return res.status(400).json({
                error: 'name has already been',
            });
        }
        const product = new Product(req.body);
        const result = await product.save();
        return res.status(201).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'server error',
        });
    }
};

exports.remove = async (req, res) => {
    let product = req.product;
    try {
        clearImageByFilePath(product.photo);
        product.remove();
        return res.status(200).json({
            message: 'Product deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            error: errorHandler(error),
        });
    }
};

exports.update = async (req, res) => {
    try {
        // get and validation req body
        const {name, price, category, photo} = req.body;
        if (!name || !price || !category || !photo) {
            return res.status(400).json({
                error: 'All fields are required',
            });
        }

        let product = req.product;
        // check name is already exists and name is similar by id
        const isSimilar = await Product.findOne({name: name});
        const isNewPhoto = product.photo !== photo;

        if (!!isSimilar && product.name !== name) {
            return res.status(400).json({
                error: 'name has already been',
            });
        } else {
            if (isNewPhoto) {
                clearImageByFilePath(product.photo);
            }
        }

        product = _.extend(product, req.body);
        const result = await product.save();
        return res.status(201).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'server error',
        });
    }
};

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found',
                });
            }
            res.json(products);
        });
};

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    Product.find({_id: {$ne: req.product}, category: req.product.category})
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found',
                });
            }
            res.json(products);
        });
};

exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: 'Categories not found',
            });
        }
        res.json(categories);
    });
};

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1],
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found',
                });
            }
            res.json({
                size: data.length,
                data,
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};
