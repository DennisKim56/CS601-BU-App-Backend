const Course = require("../models/courses");
const Gradebook = require("../models/gradebooks");
const Plan = require("../models/plans");
const User = require("../models/users");

const getGradebookById = async (req, res, next) => {
  const userId = req.userData.userId;
  const gradebookId = req.body.gradebookId;

  let gradebook;
  try {
    gradebook = await Gradebook.findById(gradebookId);
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
  if (!user) {
    return res.status(500).json({ message: "User missing" });
  }

  try {
    plan = await Plan.findById(planId).populate({
      path: "courseList",
      populate: [
        {
          path: "course",
        },
      ],
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not find plan" });
  }
  if (!plan) {
    return res.status(500).json({ message: "Plan missing" });
  }
  if (plan.user != userId) {
    return res.status(500).json({ message: "Plan does not belong to user" });
  }

  try {
    course = await Course.findById(courseId);
  } catch (error) {
    return res.status(500).json({ message: "Could not find course" });
  }
  if (!course) {
    return res.status(500).json({ message: "Course missing" });
  }
  if (
    plan.courseList.find((courseItem) => {
      const courseObject = courseItem.toObject({ getters: true });
      return courseObject.course.id == courseId;
    }) == undefined
  ) {
    return res.status(500).json({ message: "Course does not exist in plan." });
  }

  const createdGradebook = new Gradebook({
    user: user,
    plan: plan,
    course: course,
  });

  let gradebook;
  try {
    gradebook = await createdGradebook.save();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json({ gradebook: gradebook.toObject({ getters: true }) });
};

const updateGradebook = async (req, res, next) => {
  const userId = req.userData.userId;
  const gradebookId = req.body.gradebookId;
  const newGradeItems = req.body.newGradeItems;

  // Get user object
  let user;
  try {
    user = await User.findById(userId).exec();
  } catch (error) {
    return res.status(500).json({ message: "Could not find user" });
  }

  if (!user) {
    return res.status(401).json({ message: "User does not exist" });
  }

  // Check if there is an existing gradebook for user
  let gradebook;
  try {
    gradebook = await Gradebook.findById(gradebookId).exec();
  } catch (error) {
    return res.status(500).json({ message: "Could not search for gradebook" });
  }

  if (!gradebook || gradebook.user != userId) {
    return res.status(400).json({ message: "Cannot find gradebook for user" });
  }

  if (
    !newGradeItems ||
    !Array.isArray(newGradeItems) ||
    newGradeItems.length < 1
  ) {
    return res
      .status(400)
      .json({ message: "Request missing proper grade items" });
  }

  gradebook.gradeItems = newGradeItems;

  let updatedGradebook;
  try {
    updatedGradebook = await gradebook.save();
  } catch (error) {
    return res.status(500).json({
      message: "Transaction failed for gradebook update: " + error.message,
    });
  }
  res
    .status(201)
    .json({ gradebook: updatedGradebook.toObject({ getters: true }) });
};

const deleteGradebook = async (req, res, next) => {
  const userId = req.userData.userId;
  const gradebookId = req.body.gradebookId;

  let gradebook;
  try {
    gradebook = await Gradebook.findById(gradebookId);
  } catch (error) {
    return res.status(500).json({ message: "Could not find gradebook" });
  }

  if (gradebook && gradebook.user == userId) {
    try {
      await gradebook.deleteOne();
    } catch (error) {
      return res.status(500).json({ message: "Could not delete gradebook" });
    }
  } else {
    return res.status(404).json({ message: "No gradebook found" });
  }

  res.status(200).json({ message: "Gradebook deleted" });
};

exports.getGradebookById = getGradebookById;
exports.createGradebook = createGradebook;
exports.updateGradebook = updateGradebook;
exports.deleteGradebook = deleteGradebook;
