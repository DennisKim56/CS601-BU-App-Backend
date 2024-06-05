const express = require("express");
const router = express.Router();

const programControllers = require("../controllers/programs");

router.post("/", programControllers.createProgram);

router.get("/all", programControllers.getAllPrograms);

router.get("/", programControllers.getProgram);

module.exports = router;
