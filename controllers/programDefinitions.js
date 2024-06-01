const ChoiceCourse = require("../models/choiceCourses");
const Course = require("../models/courses");
const Program = require("../models/programs");
const ProgramDefinition = require("../models/programDefinitions");

const createProgramDefinition = async (req, res, next) => {
  // Get program id
  let program;
  try {
    program = await Program.findOne({
      subject: req.body.subject,
      concentration: req.body.concentration,
    }).exec();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  if (!program) {
    return res.status(404).json({ message: "No program found" });
  }

  // Get required courses
  let reqCourseIds = [];
  for (const courseId of req.body.requiredCourses) {
    let course;
    try {
      course = await Course.findOne({ courseId: courseId }).exec();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

    if (course) {
      reqCourseIds.push(course.id);
    } else {
      return res
        .status(404)
        .json({ message: "Course " + courseId + " not found." });
    }
  }

  // Get elective courses
  let electiveCourseIds = [];
  for (const courseId of req.body.electiveCourses) {
    let course;
    try {
      course = await Course.findOne({ courseId: courseId }).exec();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

    if (course) {
      electiveCourseIds.push(course.id);
    } else {
      return res
        .status(404)
        .json({ message: "Course " + courseId + " not found." });
    }
  }

  // Get choice courses
  let choiceCoursePairs = [];
  if (req.body?.choiceCourses?.length > 0) {
    for (const coursePair of req.body.choiceCourses) {
      const choice1 = coursePair.choice1;
      const choice2 = coursePair.choice2;
      let course1;
      let course2;

      try {
        course1 = await Course.findOne({ courseId: choice1 }).exec();
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
      if (!course1) {
        return res
          .status(404)
          .json({ message: "Course " + choice1 + " not found." });
      }

      try {
        course2 = await Course.findOne({ courseId: choice2 }).exec();
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
      if (!course2) {
        return res
          .status(404)
          .json({ message: "Course " + choice2 + " not found." });
      }
      const choiceCourse = new ChoiceCourse({
        choice1: course1.id,
        choice2: course2.id,
      });
      let newChoiceCourse;
      try {
        newChoiceCourse = await choiceCourse.save();
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
      console.log(newChoiceCourse._id);
      if (newChoiceCourse) {
        choiceCoursePairs.push(newChoiceCourse._id);
      }
    }
  }

  const createdProgramDefinition = new ProgramDefinition({
    program: program.id,
    requiredCourses: reqCourseIds,
    electiveCourses: electiveCourseIds,
    choicesCourses: choiceCoursePairs,
    requiredCount: req.body.requiredCount,
    electiveCount: req.body.electiveCount,
    choiceCount: req.body.choiceCount,
  });

  let programDefinition;
  try {
    programDefinition = await createdProgramDefinition.save();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res
    .status(201)
    .json({ programDefinition: programDefinition.toObject({ getters: true }) });
};

const getProgramDefinition = async (req, res, next) => {
  // Get program id
  let program;
  try {
    program = await Program.findOne({
      subject: req.body.subject,
      concentration: req.body.concentration,
    }).exec();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  if (!program) {
    return res.status(404).json({ message: "No program found" });
  }

  // Get program definition
  let programDefinition;
  try {
    programDefinition = await ProgramDefinition.findOne({
      program: program._id,
    })
      .populate("requiredCourses")
      .populate("electiveCourses")
      .populate("choicesCourses");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  if (programDefinition) {
    res.json({
      programDefinition: programDefinition.toObject({ getters: true }),
    });
  } else {
    return res.status(404).json({ message: "No program definition found" });
  }
};

exports.createProgramDefinition = createProgramDefinition;
exports.getProgramDefinition = getProgramDefinition;