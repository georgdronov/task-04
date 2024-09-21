const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authenticateTokenAndCheckStatus = require("../authMiddleware");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Registering user:", { email });

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length > 0) {
      console.log("Registration failed: User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ userId: users.insertId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const [result] = await db.query(
      "INSERT INTO users (email, password, token) VALUES (?, ?, ?)",
      [email, hashedPassword, token]
    );

    console.log("User registered successfully:", {
      userId: result.insertId,
      token,
    });
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Logging in user:", { email });

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      console.log("Login failed: User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Login failed: Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    if (user.status === "blocked" || user.status === "deleted") {
      console.log("Login failed: Account is blocked or deleted");
      return res.status(403).json({ message: "Account is blocked or deleted" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    await db.query("UPDATE users SET token = ? WHERE id = ?", [token, user.id]);

    console.log("Login successful:", { userId: user.id, token });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/check-auth", authenticateTokenAndCheckStatus, (req, res) => {
  console.log("Authentication check successful for user:", req.user.id);
  res.json({ isAuthenticated: true });
});

module.exports = router;
