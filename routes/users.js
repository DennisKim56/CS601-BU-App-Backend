const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/users");

router.get("/", userControllers.getUsers);

router.post("/signup", userControllers.signup);

router.post("/login", userControllers.login);

module.exports = router;
