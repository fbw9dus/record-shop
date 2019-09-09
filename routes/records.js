const express = require('express');
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);
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
