const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);


exports.getRecords = async (req, res, next) => {
    const records = db.get('records').value()
    res.status(200).send(records);
}

exports.getRecord = async (req, res, next) => {
    const { id } = req.params;
    const record = db.get('records').find({ id });
    res.status(200).send(record);
}

exports.deleteRecord = async (req, res, next) => {
    const { id } = req.params;
    const record = db.get('records').remove({ id });
    res.status(200).send(record);
}

exports.addRecord = async (req, res, next) => {
    const record = req.body;
    db.get('records').push(record)
        .last()
        .assign({ id: Date.now().toString() })
        .write()

    res.status(200).send(record);
}