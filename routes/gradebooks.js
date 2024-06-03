const checkAuth = require("../utility/check-auth");
const express = require("express");
const router = express.Router();

const gradebookControllers = require("../controllers/gradebooks");

router.use(checkAuth);

router.post("/", gradebookControllers.createGradebook);

router.get("/", gradebookControllers.getGradebookById);

router.patch("/", gradebookControllers.updateGradebook);

router.delete("/", gradebookControllers.deleteGradebook);

module.exports = router;
