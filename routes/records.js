const express = require('express');
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);

/**
 * GET all records
 */
router.get('/', function(req, res, next) {
    const records = db.get('records')
        .value()
    res.status(200).send(records)
});


/**
 * POST a record
 */
router.post('/', function(req, res, next) {
    let record = req.body;
    db.get('records').push(record)
        .last()
        .assign({ id: Date.now().toString() })
        .write()
        
    res.status(200).send(record);
});

module.exports = router;
