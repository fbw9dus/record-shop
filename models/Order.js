const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  quantity: {
    type: Number,
    required: true
  },
  record: {
    ref: "Record",
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model("Order", OrderSchema);
