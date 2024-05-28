const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/users");

router.get("/", (req, res, next) => {
  console.log("GET REQUEST IN USERS");
  res.json({ message: "it works!" });
});

module.exports = router;
