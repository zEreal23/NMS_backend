const T = require('../models/t');
const Order = require('../models/order');
const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandler');
const {json} = require('body-parser');

exports.tById = (req, res, next, id) => {
    T.findById(id).exec((err, t) => {
        if (err || !t) {
            return res.status(400).json({
                error: 'Table does not exist',
            });
        }
        req.t = t;
        next();
    });
};

exports.validatorOrderId = (req, res, next, id) => {
    Order.findById(id).exec((err, order) => {
        if (err || !order) {
            return res.status(400).json({
                error: 'Table does not exist',
            });
        }
        req.orderId = order._id.toString();
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
        res.json({data});
    });
};

exports.read = (req, res) => {
    return res.json(req.t);
};

/*exports.update = (req, res) => {
    console.log('req.body', req.body.name);
    const t = req.t;
    console.log(t)
    t.name = req.body.name;
    console.log(t.name)
    t.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};*/

exports.update = async(req, res) => {
    const { name } = req.body;

    if(!name) {
        return res.status(400).json({
            error: 'Bad Request'
        });
    }


    
    try {
        const data = await T.findOneAndUpdate({ _id: req.t._id }, {$set: {name:name}})
         console.log(data)
         return res.status(200).json(data)
    } catch (err){
        return res.status(400).json({ error: errorHandler(err)})
    }
  }

exports.remove = (req, res) => {
    const t = req.t;
    t.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({
            message: 'Table deleted',
        });
    });
};

exports.list = async (req, res) => {
    try {
        const tables = await T.find();
        const orders = await Order.find().where('status').equals('Waiting');

        const result = tables.map((table, index) => {
            const nameTable = table.name;
            const orderTabe = orders.filter((o) => {
                return o.table.name === nameTable;
            });
            return {
                _id: table._id.toString(),
                name: table.name,
                createdAt: table.createdAt,
                updatedAt: table.updatedAt,
                cart: {
                    status: orderTabe.length > 0 ? true : false,
                },
            };
        });
        return res.json(result);
    } catch (error) {
        return res.status(500).json({error: 'somting went worng'});
    }

    // T.find()
    //     .populate('')
    //     .exec((err, data) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 error: errorHandler(err),
    //             });
    //         }
    //         console.log('data', data);
    //         res.json(data);
    //     });
};

exports.postCart = async (req, res, next) => {
    try {
        const prodId = req.body.productId;
        console.log(prodId)
        const t = req.t;
        const product = await Product.findById(prodId);
        await t.addToCart(product);
        return res.status(200).json({message:"Success"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Failed'});
    }
};

exports.getCart = (req, res, next) => {
    req.t
        .populate('cart.items.productId')
        .execPopulate()
        .then((t) => {
            const products = t.cart.items;
            return res.json({products});
        })
        .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    req.t
        .removeFromCart(prodId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
    const amount = req.body.amount;
    console.log(amount);
    req.t
        .populate('cart.items.productId')
        .execPopulate()
        .then((table) => {
            console.log(table.cart.items);
            const products = table.cart.items.map((i) => {
                return {quantity: i.quantity, product: {...i.productId._doc}};
            });
            const order = new Order({
                table: {
                    name: req.t.name,
                    tableId: req.t,
                },
                products: products,
                amount: amount,
            });
            return order.save();
        })
        .then((result) => {
            return req.t.clearCart();
        })
        .then(() => {
            res.status(200).json({});
        })
        .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({'table.tableId': req.t._id})
        .where('status')
        .equals('Waiting')
        .then((orders) => {
            res.status(200).json({orders: orders});
        })
        .catch((err) => console.log(err));
};
