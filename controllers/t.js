const T = require("../models/t");
const Order = require('../models/order')
const Product = require("../models/product")
const { errorHandler } = require("../helpers/dbErrorHandler");
const { json } = require("body-parser");

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

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log('1',prodId)
  const t = req.t;
  Product.findById(prodId)
    .then(product => {
      console.log(t)
      return t.addToCart(product)
    })
    .then(result => {
      console.log(result);
    });
};

exports.getCart = (req, res, next) => {
  req.t
    .populate('cart.items.productId')
    .execPopulate()
    .then(t => {
      const products = t.cart.items;
      return res.json({products})
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId)
  req.t
    .removeFromCart(prodId)
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  const amount = req.body.amount
  console.log(amount)
  req.t
    .populate('cart.items.productId')
    .execPopulate()
    .then(table => {
      console.log(table.cart.items)
      const products = table.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        table: {
          name: req.t.name,
          tableId: req.t,
        },
        products: products,
        amount: amount
      });
      return order.save();
    })
    .then(result => {
      return req.t.clearCart();
    })
    .then(() => {
      res.status(200).json({})
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'table.tableId': req.t._id })
    .then(orders => {
      res.status(200).json({  orders: orders})
    })
    .catch(err => console.log(err));
};
