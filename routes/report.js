const express = require('express');
const {reportBestSeles, reportBadSeles} = require('../controllers/report');
const router = express.Router();

router.get('/report/best-seles', reportBestSeles);
router.get("/report/bad-seles" , reportBadSeles);

module.exports = router;
