const express = require("express");
const checkAuth = require("../utility/check-auth");
const router = express.Router();

const userControllers = require("../controllers/users");

router.get("/", userControllers.getUsers);

router.post("/signup", userControllers.signup);

router.post("/login", userControllers.login);

router.use(checkAuth);

router.get("/check", userControllers.isActive);

module.exports = router;
