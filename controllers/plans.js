const Course = require("../models/courses");
const Plan = require("../models/plans");
const Program = require("../models/programs");
const User = require("../models/users");

const mongoose = require("mongoose");

const getPlanById = async (req, res, next) => {
  const userId = req.userData.userId;
  const planId = req.body.planId;

  let plan;
  try {
    plan = await Plan.findById(planId)
      .populate("program")
      .populate({
        path: "courseList",
        populate: [
          {
            path: "course",
          },
          {
            path: "gradebook",
          },
        ],
      });
  } catch (error) {
    return res.status(500).json({ message: "Could not find plan" });
  }

  if (plan && plan.user == userId) {
    res.json({ plan: plan.toObject({ getters: true }) });
  } else {
    return res.status(404).json({ message: "No plan found" });
  }
};

const createPlan = async (req, res, next) => {
  const userId = req.userData.userId;
  const startingTerm = req.body.startingTerm;
  const startingYear = req.body.startingYear;
  const programId = req.body.program;
  const courseList = req.body.courseList;

  // Verify all needed parameters exist
  if (!startingTerm) {
    return res.status(400).json({ message: "Request missing starting term" });
  }
  if (!startingYear) {
    return res.status(400).json({ message: "Request missing starting year" });
  }
  if (typeof startingYear !== "number") {
    return res.status(400).json({ message: "Starting year must be a number" });
  }
  if (!programId) {
    return res.status(400).json({ message: "Request missing program" });
  }
  if (!courseList || !Array.isArray(courseList) || courseList.length < 1) {
    return res.status(400).json({ message: "Request missing proper courses" });
  }

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

  // Check if there is an existing plan for user
  let plan;
  try {
    plan = await Plan.find({ user: userId }).exec();
  } catch (error) {
    return res.status(500).json({ message: "Could not search for plan" });
  }

  if (plan?.length > 0) {
    return res.status(400).json({ message: "Plan already exists for user" });
  }

  // Check for valid program
  let program;
  try {
    program = await Program.findById(programId).exec();
  } catch (error) {
    return res.status(500).json({ message: "Error searching for program" });
  }

  if (!program) {
    return res.status(400).json({ message: "Could not find program" });
  }

  // Build courselist
  let newCourseList = [];
  for (const courseObj of courseList) {
    const courseId = courseObj.courseId;
    const sequence = courseObj.sequence;
    if (!courseId || !sequence || typeof sequence !== "number") {
      return res
        .status(400)
        .json({ message: "Malformed object in course list" });
    }

    let course;
    try {
      course = await Course.findById(courseId).exec();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error searching for course " + courseId });
    }

    if (!course) {
      return res
        .status(400)
        .json({ message: "Could not find course " + courseId });
    }

    newCourseList.push({ course: course, sequence: sequence });
  }

  plan = new Plan({
    user: userId,
    startingTerm: startingTerm,
    startingYear: startingYear,
    program: program,
    courseList: newCourseList,
  });

  let newPlan;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    newPlan = await plan.save({ session: sess });
    user.plan = plan.id;
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Could not save new plan: " + error.message });
  }
  res.status(201).json({ plan: newPlan.toObject({ getters: true }) });
};

const updatePlan = async (req, res, next) => {};

const deletePlan = async (req, res, next) => {
  const userId = req.userData.userId;
  const planId = req.body.planId;

  let plan;
  try {
    plan = await Plan.findById(planId).exec();
  } catch (error) {
    return res.status(500).json({ message: "Could not find plan" });
  }

  if (plan && plan.user == userId) {
    try {
      await plan.deleteOne();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Could not delete plan " + error.message });
    }
  } else {
    return res.status(404).json({ message: "No plan found" });
  }

  res.status(200).json({ message: "Plan deleted" });
};

exports.getPlanById = getPlanById;
exports.createPlan = createPlan;
exports.updatePlan = updatePlan;
exports.deletePlan = deletePlan;
