const mongoose = require("mongoose");
const { Schema } = mongoose;
const AddressSchema = require('./Address')
const encryption = require('../lib/validation/encryption')
const jwt = require('jsonwebtoken')
const superSecretKey = "ohpkß05zzj5766571kk7?&/"

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: 'String',
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    address: AddressSchema,
    orders: [{
      ref: "Order",
      type: mongoose.Types.ObjectId
    }],
    tokens: [
      {
        token: {
          type: String,
          required: true
        },
        access: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

UserSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre("save", async function(next) {
  if(!this.isModified("password")) return next()
  this.password = await encryption.encrypt(this.password)
  
  next()
});

UserSchema.pre("findOneAndUpdate", async function(next) {
  if(!this.getUpdate().password) return next()
  this._update.password = await encryption.encrypt(this._update.password)
  
  next()
});

UserSchema.methods.generateAuthToken = function() {
  const user = this
  const access = "auth"
  const token = jwt
    .sign({ _id: user._id.toHexString(), access}, superSecretKey)
    .toString()

    user.tokens.push({token, access})

  return token
}

UserSchema.statics.findByToken = function(token) {
  const User = this
  let decoded

  try {
    decoded = jwt.verify(token, superSecretKey);
  } catch (e) {
    return;
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  })
}

module.exports = mongoose.model("User", UserSchema);
