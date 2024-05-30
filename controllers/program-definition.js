const ProgramDefinition = require("../models/program-definition");

const createProgramDefinition = async (req, res, next) => {
  const createdProgramDefinition = new ProgramDefinition({
    name: req.body.name,
    concentrations: req.body.concentrations,
  });
  const result = await createdProgramDefinition.save();

  res.json(result);
};

const getProgramDefinition = async (req, res, next) => {
  const programs = await ProgramDefinition.find().exec();
  res.json(programs);
};

exports.createProgramDefinition = createProgramDefinition;
exports.getProgramDefinition = getProgramDefinition;
