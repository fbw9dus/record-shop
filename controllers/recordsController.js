const Record = require ("../models/Record");

exports.getRecords = async (req, res, next) => {
  const records = await Record.find()
  
  res.status(200).send(records);
};

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
