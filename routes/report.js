const express = require('express');
const {reportBestSeles, reportBadSeles, reportImcomeDays, reportImcomeMonth} = require('../controllers/report');
const router = express.Router();

router.get('/report/best-seles', reportBestSeles);
router.get("/report/bad-seles" , reportBadSeles);
router.get("/report/days" , reportImcomeDays);
router.get("/report/months" , reportImcomeMonth);

module.exports = router;
