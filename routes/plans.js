const checkAuth = require("../utility/check-auth");
const express = require("express");
const router = express.Router();

const planControllers = require("../controllers/plans");

router.use(checkAuth);

router.get("/", planControllers.getPlanById);

router.post("/", planControllers.createPlan);

router.patch("/", planControllers.updatePlan);

router.delete("/", planControllers.deletePlan);

module.exports = router;
