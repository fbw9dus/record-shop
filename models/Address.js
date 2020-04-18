const { Schema } = require('mongoose')

module.exports = new Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
})