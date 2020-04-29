var faker = require("faker");
const mongoose = require("mongoose");
const User = require("../models/User");

console.log("I shall seed");

const crypto = require('crypto');

const SHA512 = (data)=> {
  const hash = crypto.createHash('sha512');
  hash.update(data);
  return hash.digest('hex');
}

(async function() {
  /**CONNECT TO DB */
  mongoose.connect("mongodb://localhost:27017/record-shop", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on("error", console.error);
  mongoose.connection.on("open", function() {
    console.log("Database connection established...");
  });

  console.log("I will purge all the old users...");

  try {
    await User.deleteMany({});
    console.log("Users purged");
  } catch (err) {
    console.error(err);
  }

  const userPromises = Array(10)
    .fill(null)
    .map(() => {
      let u,p = faker.internet.password();
      const user = new User({
        firstName: faker.name.firstName(),
        lastName:  faker.name.lastName(),
        email:     u = faker.internet.email().toLowerCase(),
        password:  SHA512( p + '!record-shop')
      });
      console.log(u,p);
      return user.save();
    });

  try {
    await Promise.all(userPromises);
    console.log("Users seeded");
  } catch (e) {
    console.error(e);
  }

  mongoose.connection.close();
})();
