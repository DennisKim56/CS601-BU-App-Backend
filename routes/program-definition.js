const express = require("express");
const router = express.Router();

const programDefinitionControllers = require("../controllers/program-definition");

router.post("/", programDefinitionControllers.createProgramDefinition);

router.get("/", programDefinitionControllers.getProgramDefinition);

module.exports = router;
