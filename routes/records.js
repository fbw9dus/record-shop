const express = require('express');
const router = express.Router();

/**
 * GET all records
 */
router.get('/', function(req, res, next) {
    res.send('Here we shall return the records');
});


/**
 * POST a record
 */
router.post('/', function(req, res, next) {
    res.send('Here we shall return the new stored record they user send');
});

module.exports = router;
