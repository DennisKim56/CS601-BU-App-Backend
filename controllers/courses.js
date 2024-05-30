const Course = require("../models/courses");

const addCourse = async (req, res, next) => {
  const newCourse = new Course({
    courseId: req.body.courseId,
    title: req.body.title,
    description: req.body.description,
    requirements: req.body.requirements,
  });
  let result;
  try {
    result = await newCourse.save();
  } catch (error) {
    return res.status(500).json({ message: "Could not add new course" });
  }
  res.status(201).json(result);
};

const getCourses = async (req, res, next) => {
  const courseIdList = req.body.courseIds ?? [];
  let courses;
  try {
    courses = await Course.find({ courseId: { $in: courseIdList } });
  } catch (error) {
    return res.status(500).json({ message: "Could not find courses" });
  }

  res.json({
    courses: courses.map((course) => course.toObject({ getters: true })),
  });
};

exports.addCourse = addCourse;
exports.getCourses = getCourses;
