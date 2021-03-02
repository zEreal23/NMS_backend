const {Order,CartItem} = require('../models/order');
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create=(req,res)=>{
    console.log("CREATE ORDER",req.body);
    req.body.order.Tables = req.profile
    const order = new Order(req.body.order)
    console.log(order)
    order.save((err,data)=>{
        if(err){
            return res.status(404).json({
                error:errorHandler(err)
            })
        }
        res.json(data);
    })
};

exports.listOrders = (req,res) =>{
    Order.find()
    
    .sort("-created")
    .exec((err,orders)=>{
        if(err){
            return res.status(404).json({
                error:errorHandler(err)
            })
        }
        res.json(orders)
    })
}