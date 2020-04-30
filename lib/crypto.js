
// crypto ist ein in nodejs eingebautes modul
const crypto = require('crypto');

// die SHA512 function ist eine abkürzung
//  damit wir nicht immer alle 3 befehle aufrufen müssen
const SHA512 = (data)=> {
  const hash = crypto.createHash('sha512');
  hash.update(data);
  return hash.digest('hex');
};

module.exports = { SHA512 };
