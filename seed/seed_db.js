var faker = require("faker");
const mongoose = require("mongoose");
const User = require("../models/User");
const Record = require("../models/Record");
console.log("I shall seed");
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
    await
    console.log("Users purged");
  } catch (err) {
    console.error(err);
  }
  const userPromises = Array(100)
    .fill(null)
    .map(() => {
      const user = new User({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        img: faker.image.image()
      });
      return user.save();
    });
  try {
    await Promise.all(userPromises);
    console.log("Users seeded");
  } catch (e) {
    console.error(e);
  }
  try {
    await Record.deleteMany({});
    console.log("Records purged");
  } catch (err) {
    console.error(err);
  }
  const recordPromises = Array(100)
  .fill(null)
  .map(() => {
    const record = new Record({
      title: faker.name.lastName(),
      artist: faker.name.firstName(),
      year: faker.random.number(),
      img: faker.image.image(),
      price:faker.commerce.price()
    });
    return record.save();
  });
try {
  await Promise.all(recordPromises);
  console.log("Record seeded");
} catch (e) {
  console.error(e);
}
  mongoose.connection.close();
})();
