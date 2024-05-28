const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  concentrations: [String],
});

module.exports = mongoose.model("Program", programSchema);
