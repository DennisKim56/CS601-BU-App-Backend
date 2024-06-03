const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "email name");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Get Users failed. Please try again later." });
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const { name, email, username, password, program } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Signup failed. Please try again later." });
  }

  if (existingUser) {
    return res.status(422).json({ message: "User with email already exists" });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return res.status(500).json({ message: "Could not create user." });
  }

  const createdUser = new User({
    name,
    email,
    username,
    password: hashedPassword,
    program,
  });

  try {
    await createdUser.save();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  let token;
  try {
    token = jwt.sign({ userId: createdUser.id }, "boston_university_secret", {
      expiresIn: "1h",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json({ userId: createdUser.id, token: token });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed. Please try again later." });
  }

  if (!existingUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch {
    return res
      .status(500)
      .json({ message: "Login failed. Please try again later." });
  }

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id }, "boston_university_secret", {
      expiresIn: "1h",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ userId: existingUser.id, token: token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
