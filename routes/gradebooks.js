const express = require("express");
const router = express.Router();

const gradebookControllers = require("../controllers/gradebooks");

router.get("/:gradebookId", gradebookControllers.getGradebookById);

module.exports = router;
