const express = require('express')
const router = express.Router()

const {talbeById , read , list , create , update ,remove} = require('../controllers/table')
const {requireSignin, isAuth , isAdmin} = require('../controllers/auth')
const {userById} = require('../controllers/user')

router.get('/table' , list );
router.get('/table/:tableId', read)
router.post('/table/create/:userId' , requireSignin , isAuth ,isAdmin , create)
router.put('/table/:tableId/:userId', requireSignin , isAuth , isAdmin ,update)
router.delete('/table/:tableId/:userId', requireSignin , isAuth ,isAdmin ,remove)

router.param("userId" , userById)
router.param("tableId" , talbeById)

module.exports = router