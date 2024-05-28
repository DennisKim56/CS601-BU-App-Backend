const express = require("express");
const router = express.Router();

const courseControllers = require("../controllers/courses");

router.get("/:programId", (req, res, next) => {
  const programId = req.params.programId;
});

module.exports = router;
