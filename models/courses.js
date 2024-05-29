const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  requirements: { type: String },
});

module.exports = mongoose.model("Course", courseSchema);
