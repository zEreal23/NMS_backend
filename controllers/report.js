const Product = require('../models/product');
const Order = require('../models/order');
const moment = require('moment');
const _ = require('lodash');

exports.reportBestSeles = async (req, res) => {
    try {
        const products = await Product.find().sort('-sold').limit(5).populate('category');

        const result = products.map((product, index) => ({
            no: index + 1,
            amount: product.sold,
            name: product.name,
            category: product.category.name,
        }));
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};

exports.reportBadSeles = async (req, res) => {
    try {
        const products = await Product.find().sort('sold').limit(5).populate('category');
        const result = products.map((product, index) => ({
            no: index + 1,
            amount: product.sold,
            name: product.name,
            category: product.category.name,
        }));
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};

exports.reportImcomeWeek = async (req, res) => {

    const week = 7;
    let result = [];

    try {
        for(let i = 0; i < week; i++) {
            const startDay = moment().subtract(i, 'days').startOf('day')
            const endDay = moment().subtract(i, 'days').endOf('day')
            const order = await Order.find({updatedAt: {$gte: startDay, $lt: endDay}});
            let sum = _.reduce(order, function(memo, reading){ return memo + reading.amount; }, 0);
            const data = {
                time: moment().subtract(i, 'days'),
                day: moment().subtract(i, 'days').calendar(),
                amount: sum
            }

            result.push(data)
        }
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};
