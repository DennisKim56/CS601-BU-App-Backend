const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  startingTerm: { type: String, required: true },
  startingYear: { type: Number, required: true },
  program: { type: mongoose.Types.ObjectId, required: true, ref: "Program" },
  courseList: [
    {
      type: {
        course: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "Course",
        },
        sequence: { type: Number, required: true },
        grade: { type: Number },
        gradebook: {
          type: mongoose.Types.ObjectId,
          ref: "Gradebook",
        },
      },
    },
  ],
});

module.exports = mongoose.model("Plan", planSchema);
