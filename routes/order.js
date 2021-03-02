const express = require("express")
const router = express.Router();
const {requireSignin,isAuth} = require("../controllers/auth");
const {talbeById} = require("../controllers/table");
const {create,listOrders} = require("../controllers/order");

router.post('/order/create/:tableId',create);
router.param("tableId" , talbeById)

module.exports = router;

router.get('/order/list',listOrders);