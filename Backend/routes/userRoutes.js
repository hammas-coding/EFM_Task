const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser,adminCreateUser
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/admin-create", protect, admin, adminCreateUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/", protect, admin, getAllUsers);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
