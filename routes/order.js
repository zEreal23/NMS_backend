const express = require('express');
const router = express.Router();

const {tById, validatorOrderId} = require('../controllers/t');
const {create, listOrders, completeOrders} = require('../controllers/order');

router.get('/order/list', listOrders);
router.post('/order/create/:tableId', create);
router.put('/order/complete/:orderId', completeOrders);

router.param('tableId', tById);
router.param('orderId', validatorOrderId);

module.exports = router;
