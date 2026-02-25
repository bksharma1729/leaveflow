const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../config/generateToken");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: passwordHash,
    role: "employee",
  });

  const token = generateToken({ id: user._id, role: user.role });

  return res.status(201).json({
    message: "Registered successfully",
    token,
    user: sanitizeUser(user),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({ id: user._id, role: user.role });

  return res.json({
    message: "Login successful",
    token,
    user: sanitizeUser(user),
  });
};


const me = async (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
};

module.exports = { register, login, me };
