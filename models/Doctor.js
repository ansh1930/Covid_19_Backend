const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  Fullname: {
    type: String,
    required: true
  },
  DOB: {
    type: String,
    required: true
  },
  Gender: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  Location: {
    type: String,
    required: true
  },
  Mobile: {
    type: String,
    required: true
  },
  Info: {
    type: String,
    required: false
  },
  Experience: {
    type: String,
    required: true
  },
  Specialist: {
    type: String,
    required: true
  },
});

module.exports = User = mongoose.model("Docotor", UserSchema);
