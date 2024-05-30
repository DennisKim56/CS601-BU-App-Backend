const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  program: { type: mongoose.Types.ObjectId, required: true, ref: "Program " },
  plan: { type: mongoose.Types.ObjectId, required: true, ref: "Plan" },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
