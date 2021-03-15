const Order = require('../models/order');
const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    console.log('CREATE ORDER', req.body);
    req.body.order.table = req.t;
    const order = new Order(req.body.order);
    console.log(order);
    order.save((err, data) => {
        if (err) {
            return res.status(404).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.listOrders = (req, res) => {
    Order.find()
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(404).json({
                    error: errorHandler(err),
                });
            }
            res.json(orders);
        });
};

exports.completeOrders = async (req, res) => {
    try {
        const orderId = req.orderId;
        const complete = {status: 'Done'};
        const order = await Order.findByIdAndUpdate(orderId, complete);

        order.products.forEach(async (value, index) => {
            const productId = value.product._id.toString();
            await Product.findOneAndUpdate({_id: productId}, {$inc: {sold: value.quantity}});
        });

        return res.status(200).json({
            message: 'Done',
        });
    } catch (error) {
        return res.status(500).json({
            error: 'server error',
        });
    }
};
