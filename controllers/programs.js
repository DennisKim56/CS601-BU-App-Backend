const Program = require("../models/programs");

const createProgram = async (req, res, next) => {
  const createdProgram = new Program({
    name: req.body.name,
    concentrations: req.body.concentrations,
  });
  const result = await createdProgram.save();

  res.json(result);
};

const getPrograms = async (req, res, next) => {
  const programs = await Program.find().exec();
  res.json(programs);
};

exports.createProgram = createProgram;
exports.getPrograms = getPrograms;
