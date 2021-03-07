const express = require('express')
const router = express.Router()

const {create, tById, read , remove ,update ,list} = require('../controllers/t')
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth')
const {userById} = require('../controllers/user')
const tControll = require('../controllers/t')

router.get("/table/:tableId" , read)
router.post("/table/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete("/table/:tableId/:userId", requireSignin, isAuth, isAdmin, remove)
router.put("/table/:tableId/:userId", requireSignin, isAuth, isAdmin, update)
router.get("/alltable", list)

router.post('/cart/:tableId',tControll.postCart)
router.get('/cart/:tableId',tControll.getCart)
router.post('/cart-delete/:tableId',tControll.postCartDeleteProduct)

router.get('/order/:tableId', tControll.getOrders);
router.post('/create-order/:tableId', tControll.postOrder);

router.param("userId" , userById)
router.param("tableId" , tById)

module.exports = router;