const Record = require('../models/Record')

exports.getRecords = async (req, res, next) => {
  // Schreib hier code um alle records aus der records-Collection zu holen
  const records = await Record.find()
  res.status(200).send(records);
};

exports.getRecord = (req, res, next) => {
  const { id } = req.params;
  // Schreib hier code um das record mit der id aus params aus der records-Collection zu holen

  res.status(200).send(record);
};

exports.deleteRecord = (req, res, next) => {
  const { id } = req.params;
  // Schreib hier code um das record mit der id aus params aus der records-Collection zu löschen

  res.status(200).send(record);
};

exports.updateRecord = (req, res, next) => {
  const { id } = req.params;
  const dt = req.body;
  // Schreib hier code um das record mit der id aus params in der records-Collection mit den Daten aus req.body zu aktualisieren

  res.status(200).send(record);
};

exports.addRecord = (req, res, next) => {
  const record = req.body;
  // Schreib hier code um die Daten des neuen record aus req.body in der records-Collection zu speichern

  res.status(200).send(record);
};
