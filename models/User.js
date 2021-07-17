const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  Firstname: {
    type: String,
    required: true
  },
  Lastname: {
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
  }
});

module.exports = User = mongoose.model("users", UserSchema,'covid19');
