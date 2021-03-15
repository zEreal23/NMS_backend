const Product = require('../models/product');

exports.reportBestSeles = async (req, res) => {
    try {
        const products = await Product.find().sort('-sold').limit(5).populate('category');

        const result = products.map((product, index) => ({
            no: index + 1,
            amount: product.sold,
            name: product.name,
            category: product.category.name
        }))
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
            category: product.category.name
        }))
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};