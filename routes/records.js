const express = require('express');
const router = express.Router();
const { getRecords, addRecord } = require('../controllers/recordsController');


/**
 * GET all records
 */
router.get('/', getRecords);

/**
* POST a record
 */
router.post('/', addRecord);

module.exports = router;
