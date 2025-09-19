const userService = require('../service/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Signup
async function signup(req, res) {
  try {
    const { username, email, phone, password } = req.body;
    const existing = await userService.findByEmail(email);
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const user = await userService.createUser({ username, email, phone, password });
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Signin
async function signin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userService.findByEmail(email);

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// CRUD
async function getAllUsers(req, res) {
  res.json(await userService.getUsers());
}

async function getUser(req, res) {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}

async function updateUser(req, res) {
  const user = await userService.updateUser(req.params.id, req.body);
  res.json(user);
}

async function deleteUser(req, res) {
  await userService.deleteUser(req.params.id);
  res.json({ message: "User deleted" });
}

module.exports = { signup, signin, getAllUsers, getUser, updateUser, deleteUser };
