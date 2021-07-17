const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  Patientname: {
    type: String,
    required: true,
  },
  Doctorname: {
    type: String,
    required: true,
  },
  PatientEmail: {
    type: String,
    required: true,
  },
  DoctorEmail: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  Reason: {
    type: String,
    required:false
  },
});

module.exports = User = mongoose.model("Appointments", UserSchema);
