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

  const createdUser = new User({
    name,
    email,
    username,
    password,
    program,
  });

  try {
    await createdUser.save();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed. Please try again later." });
  }

  if (!existingUser || existingUser.password != password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
