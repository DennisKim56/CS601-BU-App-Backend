const mongoose = require("mongoose");

const programDefinitionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  concentrations: [String],
});

module.exports = mongoose.model("ProgramDefinition", programDefinitionSchema);
