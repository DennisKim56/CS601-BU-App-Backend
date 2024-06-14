const Course = require("../models/courses");
const Gradebook = require("../models/gradebooks");
const Plan = require("../models/plans");
const Program = require("../models/programs");
const User = require("../models/users");

const mongoose = require("mongoose");

const getPlanByUser = async (req, res, next) => {
  const userId = req.userData.userId;

  let plan;
  try {
    plan = await Plan.findOne({ user: userId })
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

  if (plan) {
    res.json({ plan: plan.toObject({ getters: true }) });
  } else {
    return res.status(204).json({ message: "No plan found" });
  }
};

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

  // Create plan and assign to user in single transaction
  let newPlan;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    newPlan = await plan.save({ session: sess });
    user.plan = plan.id;
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return res.status(500).json({
      message: "Transaction failed for plan creation: " + error.message,
    });
  }
  res.status(201).json({ plan: newPlan.toObject({ getters: true }) });
};

const updatePlan = async (req, res, next) => {
  const userId = req.userData.userId;
  const { planId, startingTerm, startingYear, programId, courseIdList } =
    req.body;

  if (!startingTerm && !startingYear && !programId && !courseIdList) {
    return res.status(400).json({ message: "No updates found" });
  }

  let plan;
  try {
    plan = await Plan.findById(planId).exec();
  } catch (error) {
    return res.status(500).json({ message: "Could not find plan" });
  }

  if (!plan || plan.user != userId) {
    return res.status(404).json({ message: "No plan found" });
  }

  if (startingTerm) {
    plan.startingTerm = startingTerm;
  }
  if (startingYear) {
    plan.startingYear = startingYear;
  }
  if (programId) {
    let program;
    try {
      program = await Program.findById(programId).exec();
    } catch (error) {
      return res.status(500).json({ message: "Error searching for program" });
    }

    if (!program) {
      return res.status(400).json({ message: "Could not find program" });
    }
    plan.program = program;
  }
  if (courseIdList && Array.isArray(courseIdList) && courseIdList.length > 0) {
    let newCourseList = [];
    for (const courseObj of courseIdList) {
      const courseId = courseObj.courseId;
      const sequence = courseObj.sequence;
      const grade = courseObj.grade;
      const gradebook = courseObj.gradebook;
      if (!courseId || !sequence || typeof sequence !== "number") {
        return res
          .status(400)
          .json({ message: "Malformed object in course list" });
      }

      let newCourse;
      try {
        newCourse = await Course.findById(courseId).exec();
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Error searching for course " + courseId });
      }

      if (!newCourse) {
        return res
          .status(400)
          .json({ message: "Could not find course " + courseId });
      }

      const newCourseObject = { course: newCourse, sequence: sequence };
      if (grade) {
        newCourseObject.grade = grade;
      }
      if (gradebook) {
        newCourseObject.gradebook = gradebook;
      }
      newCourseList.push(newCourseObject);
    }
    plan.courseList = newCourseList;
  }

  let updatedPlan;
  try {
    updatedPlan = await plan.save();
  } catch (error) {
    return res.status(500).json({
      message: "Transaction failed for plan update: " + error.message,
    });
  }
  res.status(201).json({ plan: updatedPlan.toObject({ getters: true }) });
};

const deletePlan = async (req, res, next) => {
  const userId = req.userData.userId;
  const planId = req.body.planId;

  let plan;
  try {
    plan = await Plan.findById(planId).exec();
  } catch (error) {
    return res.status(500).json({ message: "Could not find plan" });
  }

  let user;
  try {
    user = await User.findById(userId).exec();
  } catch (error) {
    return res.status(500).json({ message: "Could not find user" });
  }

  let gradebooks;
  try {
    gradebooks = await Gradebook.find({ user: userId }).exec();
  } catch (error) {
    return res.status(500).json({ message: "Could not find gradebooks" });
  }

  if (plan && plan.user == userId) {
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await plan.deleteOne({ session: sess });
      user.plan = undefined;
      await user.save({ session: sess });
      for (let i = 0; i < gradebooks.length; i++) {
        await gradebooks[i].deleteOne({ session: sess });
      }
      await sess.commitTransaction();
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

exports.getPlanByUser = getPlanByUser;
exports.getPlanById = getPlanById;
exports.createPlan = createPlan;
exports.updatePlan = updatePlan;
exports.deletePlan = deletePlan;
