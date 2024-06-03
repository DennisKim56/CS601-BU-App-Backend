const Course = require("../models/courses");
const Gradebook = require("../models/gradebooks");
const User = require("../models/users");

const getGradebookById = async (req, res, next) => {
  const userId = req.userData.userId;
  const gradebookId = req.body.gradebookId;

  let gradebook;
  try {
    gradebook = await Gradebook.findById({ gradebookId });
  } catch (error) {
    return res.status(500).json({ message: "Could not find gradebook" });
  }

  if (gradebook && gradebook.user == userId) {
    res.json({ gradebook: gradebook.toObject({ getters: true }) });
  } else {
    return res.status(404).json({ message: "No gradebook found" });
  }
};

const createGradebook = async (req, res, next) => {
  const userId = req.userData.userId;
  const planId = req.body.planId;
  const courseId = req.body.courseId;

  let user;
  let plan;
  let course;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return res.status(500).json({ message: "Could not find user" });
  }
  try {
    plan = await Plan.findById(planId);
  } catch (error) {
    return res.status(500).json({ message: "Could not find plan" });
  }
  try {
    course = await Course.findById(courseId);
  } catch (error) {
    return res.status(500).json({ message: "Could not find course" });
  }
};

const updateGradebook = async (req, res, next) => {};

const deleteGradebook = async (req, res, next) => {
  const userId = req.userData.userId;
  const gradebookId = req.body.gradebookId;

  let gradebook;
  try {
    gradebook = await Gradebook.findById({ gradebookId });
  } catch (error) {
    return res.status(500).json({ message: "Could not find gradebook" });
  }

  if (gradebook && gradebook.user == userId) {
    try {
      await gardebook.remove();
    } catch (error) {
      return res.status(500).json({ message: "Could not delete gradebook" });
    }
  } else {
    return res.status(404).json({ message: "No gradebook found" });
  }

  re.status(200).json({ message: "Gradebook deleted" });
};

exports.getGradebookById = getGradebookById;
exports.createGradebook = createGradebook;
exports.updateGradebook = updateGradebook;
exports.deleteGradebook = deleteGradebook;
