const express = require('express');
const {reportBestSeles, reportBadSeles, reportImcomeWeek} = require('../controllers/report');
const router = express.Router();

router.get('/report/best-seles', reportBestSeles);
router.get("/report/bad-seles" , reportBadSeles);
router.get("/report/week" , reportImcomeWeek);

module.exports = router;
