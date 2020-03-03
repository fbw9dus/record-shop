// Pseudo-DB-Bibliothek importieren
var { DataStore } = require('notarealdb')
// Pseudo-DB erstellen
var store = new DataStore('./data')
// Collection für Shop-Artikel
var records = store.collection('records')

// Funktion um Liste der Artikel zurückzugeben
exports.getRecords = (req, res, next) => {
    res.status(200).send(records.list());
}

// Funktion um neuen Aretikel hinzuzufügen
exports.addRecord = (req, res, next) => {
    const record = req.body;
    records.create(record)
    res.status(200).send(record);
}