const express = require("express");
const router = express.Router();

const planControllers = require("../controllers/plans");

router.get("/", planControllers.getPlan);

router.post("/", planControllers.createPlan);

module.exports = router;
