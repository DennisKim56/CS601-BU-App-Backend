const mongoose = require("mongoose");

const choiceCourseSchema = new mongoose.Schema({
  choice1: { type: mongoose.Types.ObjectId, ref: "Course" },
  choice2: { type: mongoose.Types.ObjectId, ref: "Course" },
});

module.exports = mongoose.model("ChoiceCourse", choiceCourseSchema);
