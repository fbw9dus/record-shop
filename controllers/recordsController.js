
const Record = require ("../models/Record");
const { getPaginatedList } = require('./abstractControllers');

exports.getRecords = getPaginatedList(Record);

exports.getRecord = async (req, res, next) => {
  const { id } = req.params;
  const record = await Record.findById(id);

  res.status(200).send(record);
};

exports.deleteRecord = async (req, res, next) => {
  const { id } = req.params;
  const record = await Record.findByIdAndDelete(id);

  res.status(200).send(record);
};

exports.updateRecord = async (req, res, next) => {
  const { id } = req.params;
  const data   = req.body;
  const record = await Record.findByIdAndUpdate(id,data,{new:true});

  res.status(200).send(record);
};

exports.addRecord = async (req, res, next) => {
  const records = req.body;
  const record  = new Record(records);
  await record.save();

  res.status(200).send(record);
};
