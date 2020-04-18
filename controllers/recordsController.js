const Record = require('../models/Record')
const createError = require('http-errors')

exports.getRecords = async (req, res, next) => {
  // Schreib hier code um alle records aus der records-Collection zu holen
  try {
    const records = await Record.find()
    res.status(200).send(records);
  } catch (error) {
    next(error)
  }
  
};

exports.getRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Schreib hier code um das record mit der id aus params aus der records-Collection zu holen
    const record = Record.findById(id)
    if(!record) throw new createError.NotFound()
    res.status(200).send(record);
  } catch (error) {
    next(error)
  }
  
};

exports.deleteRecord = async (req, res, next) => {
  const { id } = req.params;
  // Schreib hier code um das record mit der id aus params aus der records-Collection zu löschen
  const record = Record.findByIdAndDelete(id)
  res.status(200).send(record);
};

exports.updateRecord = async (req, res, next) => {
  const { id } = req.params;
  const dt = req.body;
  // Schreib hier code um das record mit der id aus params in der records-Collection mit den Daten aus req.body zu aktualisieren
  const record = Record.findByIdAndUpdate(id, dt)
  res.status(200).send(record);
};

exports.addRecord = async (req, res, next) => {
  const data = req.body;
  // Schreib hier code um die Daten des neuen record aus req.body in der records-Collection zu speichern
  const record = Record.create(data)
  res.status(200).send(record);
};
