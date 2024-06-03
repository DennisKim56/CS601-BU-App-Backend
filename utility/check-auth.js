const jwt = require("jsonwebtoken");

const User = require("../models/users");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const decodedToken = jwt.verify(token, "boston_university_secret");

    // Check if userId is valid
    let user;
    try {
      user = await User.findById(decodedToken.userId).exec();
    } catch (error) {
      return res.status(500).json({ message: "Could not find user" });
    }

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return res.status(500).json({ message: "Invalid credentials" });
  }
};
