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

exports.reportImcomeDays = async (req, res) => {
    const week = 7;
    let result = [];

    try {
        for (let i = 0; i < week; i++) {
            const startDay = moment().subtract(i, 'days').startOf('day');
            const endDay = moment().subtract(i, 'days').endOf('day');
            const order = await Order.find({updatedAt: {$gte: startDay, $lt: endDay}});
            let sum = _.reduce(
                order,
                function (memo, reading) {
                    return memo + reading.amount;
                },
                0,
            );
            const data = {
                time: moment().subtract(i, 'days'),
                day: moment().subtract(i, 'days').calendar(),
                amount: sum,
            };

            result.push(data);
        }
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};

exports.reportImcomeMonth = async (req, res) => {
    const month = Number(moment().format('MM'));
    let result = [];
    try {
        for(let i = 0; i < month; i++) {
            const startMonth = moment().subtract(i, 'months').startOf('month');
            const endMonth = moment().subtract(i, 'months').endOf('month');
            const order = await Order.find({updatedAt: {$gte: startMonth, $lt: endMonth}});
            let sum = _.reduce(order, function(memo, reading){ return memo + reading.amount; }, 0);
            const data = {
                time: moment().subtract(i, 'months'),
                month: moment().subtract(i, 'months').format('MMMM'),
                amount: sum
            }
            result.push(data)
        }
        return res.status(200).json({data: result});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};
