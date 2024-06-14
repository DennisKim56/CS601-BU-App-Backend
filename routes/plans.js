const express = require("express");
const router = express.Router();

const checkAuth = require("../utility/check-auth");

const planControllers = require("../controllers/plans");

router.use(checkAuth);

router.get("/id", planControllers.getPlanById);

router.get("/", planControllers.getPlanByUser);

router.post("/", planControllers.createPlan);

router.patch("/", planControllers.updatePlan);

router.delete("/", planControllers.deletePlan);

module.exports = router;
