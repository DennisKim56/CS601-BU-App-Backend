const express = require("express");
const router = express.Router();

const programDefinitionControllers = require("../controllers/programDefinitions");

router.post("/", programDefinitionControllers.createProgramDefinition);

router.get("/", programDefinitionControllers.getProgramDefinition);

module.exports = router;
