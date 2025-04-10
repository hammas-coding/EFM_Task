const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// User Registeration
const registerUser = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
      role: "user",
    });

    res.status(201).json({
      message: "User account created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin Private Register
const adminCreateUser = async (req, res) => {
  const { name, email, phoneNumber, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
      role: role || "user",
    });

    res.status(201).json({
      message: "User created successfully by admin",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.json({
        token,
        expiresIn: 3600,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// View Profile with Tasks Summary
const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const allTasks = await Task.find({ user: req.user._id });

    const completedTasks = allTasks.filter(
      (task) => task.status === "completed"
    );
    const pendingTasks = allTasks.filter((task) => task.status === "pending");

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      role: req.user.role,
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      tasks: allTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToDelete.role === "admin") {
      return res.status(403).json({ message: "Cannot delete another admin" });
    }

    if (userToDelete._id.toString() === req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Admins cannot delete themselves" });
    }

    await Task.deleteMany({ user: userToDelete._id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and associated tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
  adminCreateUser,
};
