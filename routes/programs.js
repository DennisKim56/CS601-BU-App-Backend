const express = require("express");
const router = express.Router();

const programControllers = require("../controllers/programs");

router.post("/", programControllers.createProgram);

router.get("/", programControllers.getPrograms);

module.exports = router;
