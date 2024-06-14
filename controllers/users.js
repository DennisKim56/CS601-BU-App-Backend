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
    existingUser = await User.findOne({ username: username });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Signup failed. Please try again later." });
  }

  if (existingUser) {
    return res
      .status(422)
      .json({ message: "User with username already exists" });
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
    token = jwt.sign({ userId: createdUser.id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json({
    userId: createdUser.id,
    name: createdUser.name,
    username: createdUser.username,
    token: token,
  });
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
    token = jwt.sign({ userId: existingUser.id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({
    userId: existingUser.id,
    name: existingUser.name,
    username: existingUser.username,
    token: token,
  });
};

const isActive = async (req, res, next) => {
  const userId = req.userData.userId;
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Get User failed. Please try again later." });
  }

  res.json(user.toObject({ getters: true }));
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.isActive = isActive;
