const express = require("express")
const router = express.Router();

const {tById} = require("../controllers/t");
const {create,listOrders} = require("../controllers/order");

router.get('/order/list',listOrders);
router.post('/order/create/:tableId',create);

router.param("tableId" , tById)

module.exports = router;
