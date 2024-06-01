const mongoose = require("mongoose");

const programDefinitionSchema = new mongoose.Schema({
  program: { type: mongoose.Types.ObjectId, required: true, ref: "Program" },
  requiredCourses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
  electiveCourses: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
  choicesCourses: [{ type: mongoose.Types.ObjectId, ref: "ChoiceCourse" }],
  requiredCount: { type: Number, required: true },
  electiveCount: { type: Number, required: true },
  choiceCount: { type: Number, required: true },
});

module.exports = mongoose.model("ProgramDefinition", programDefinitionSchema);
