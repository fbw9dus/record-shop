
const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema ( {
  quantity: [{
    type: Number,
    required: true
  }],
  isOpen: {
    type: Boolean,
    default: true
  },
  record: [{
    ref: "Record",
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }],
  user:{
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
},
{
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

OrderSchema.virtual("totalRecords").get(function() {
  let count = 0;
  this.quantity.forEach( value => count += value )
  return count;
});

OrderSchema.virtual("totalPrice").get(function() {
  let count = 0;
  this.record.forEach( (record,index) => count += record.price * this.quantity[index] )
  return count;
});

module.exports = mongoose.model("Order", OrderSchema);
