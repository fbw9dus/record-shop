const mongoose = require('mongoose')
const { Schema } = mongoose

mongoose.connect("mongodb://localhost:27017/bakery", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const CarSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  }
})

const Car = mongoose.model('Car', CarSchema)

const OwnerSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  car: {
    ref: "Car",
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

const Owner = mongoose.model('Owner', OwnerSchema)

;(async () => {
    // Erstellen
    const iPace = await Car.create({
      brand: "Jaguar",
      model: "iPace"
    })
    const max = await Owner.create({
      firstname: "Max",
      lastname: "Muster",
      car: iPace.id
    })

    // Lesen
    const owner = await Owner.findById(max.id).populate('car', '-__v -_id')
    console.log(owner)

})()

