const express = require('express');
const {reportBestSeles, reportBadSeles, reportImcomeDays, reportImcomeMonth, reportImcomeYear} = require('../controllers/report');
const router = express.Router();

router.get('/report/best-seles', reportBestSeles);
router.get("/report/bad-seles" , reportBadSeles);
router.get("/report/days" , reportImcomeDays);
router.get("/report/months" , reportImcomeMonth);
router.get("/report/year", reportImcomeYear)

module.exports = router;
