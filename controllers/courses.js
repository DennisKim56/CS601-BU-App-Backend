const Course = require("../models/courses");

const addCourse = async (req, res, next) => {
  const newCourse = new Program({
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
  const courses = await Course.find().exec();
  res.json(courses);
};

exports.addCourse = addCourse;
exports.getCourses = getCourses;
