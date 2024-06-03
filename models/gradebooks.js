const mongoose = require("mongoose");

const gradebookSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: "Course" },
  plan: { type: mongoose.Types.ObjectId, required: true, ref: "Plan" },
  course: { type: mongoose.Types.ObjectId, required: true, ref: "Course" },
  gradeItems: [
    {
      type: {
        sequence: { type: Number, required: true },
        label: { type: String, required: true },
        weight: { type: Number, required: true },
        grade: { type: Number },
      },
    },
  ],
});

module.exports = mongoose.model("Gradebook", gradebookSchema);
