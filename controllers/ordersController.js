exports.getOrders = (req, res, next) => {
  // Schreib hier code um alle Bestellungen aus der orders-Collection zu holen

  res.status(200).send(orders);
};

exports.getOrder = (req, res, next) => {
  const { id } = req.params;
  // Schreib hier code um die Bestellung mit der id aus params aus der orders-Collection zu holen

  res.status(200).send(order);
};

exports.deleteOrder = (req, res, next) => {
  const { id } = req.params;
  // Schreib hier code um die Bestellung mit der id aus params aus der orders-Collection zu löschen

  res.status(200).send(order);
};

exports.updateOrder = (req, res, next) => {
  const { id } = req.params;
  const dt = req.body;
  // Schreib hier code um die Bestellung mit der id aus params in der orders-Collection mit den Daten aus req.body zu aktualisieren

  res.status(200).send(order);
};

exports.addOrder = (req, res, next) => {
  const order = req.body;
  // Schreib hier code um die Daten der neuen Bestellungen aus req.body in der orders-Collection zu speichern

  res.status(200).send(order);
};
