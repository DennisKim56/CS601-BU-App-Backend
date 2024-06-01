const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  concentration: { type: String },
});

module.exports = mongoose.model("Program", programSchema);
