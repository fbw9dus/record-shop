
const crypto = require('crypto');

const SHA512 = (data)=> {
  const hash = crypto.createHash('sha512');
  hash.update(data);
  return hash.digest('hex');
};

module.exports = { SHA512 };
