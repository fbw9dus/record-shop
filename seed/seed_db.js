/** ENV VARS **/
require("dotenv").config()

if ( ! (
process.env.DB
)) {
  console.log('');
  console.log('Please provide a .env file or set the following:');
  ['DB'].forEach(
    env => console.log(' ', env)
  )
  console.log('');
  process.exit(1); }

const faker    = require("faker");
const mongoose = require("mongoose");

const User = require("../models/User");

const { SHA512 } = require('../lib/crypto.js');

console.log("I shall seed:", process.env.DB);

(async function() {
  /**CONNECT TO DB */
  mongoose.connect(process.env.DB, {
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

  let hasAdmin = false;
  const userPromises = Array(10)
    .fill(null)
    .map(() => {
      let u,p = faker.internet.password();
      let role = 'User';
      if ( ! hasAdmin ){
        role = 'Admin';
        hasAdmin = true;
      }
      const user = new User({
        firstName: faker.name.firstName(),
        lastName:  faker.name.lastName(),
        role:      role,
        email:     u = faker.internet.email().toLowerCase(),
        activated: true,
        password:  SHA512( p + '!record-shop')
      });
      console.log(u,p,role);
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
