const Program = require("../models/programs");

const createProgram = async (req, res, next) => {
  const createdProgram = new Program({
    subject: req.body.subject,
    concentration: req.body.concentration,
  });

  let program;
  try {
    program = await createdProgram.save();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json({ program: program.toObject({ getters: true }) });
};

const getProgram = async (req, res, next) => {
  let program;
  try {
    program = await Program.findOne({
      subject: req.body.subject,
      concentration: req.body.concentration,
    }).exec();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  if (program) {
    res.json({ program: program.toObject({ getters: true }) });
  } else {
    return res.status(404).json({ message: "No program found" });
  }
};

exports.createProgram = createProgram;
exports.getProgram = getProgram;
