const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    if (user.status === "blocked") {
      return res.status(403).json({ message: "User is blocked" });
    } else if (user.status === "deleted") {
      return res.status(403).json({ message: "User is deleted" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/check-auth", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [
      decoded.userId,
    ]);

    if (
      user.length > 0 &&
      user[0].status !== "deleted" &&
      user[0].status !== "blocked"
    ) {
      res.status(200).json({ isAuthenticated: true });
    } else {
      res.status(401).json({ isAuthenticated: false });
    }
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
});

router.post("/block-users", async (req, res) => {
  const { userIds } = req.body;

  try {
    await db.query("UPDATE users SET status = 'blocked' WHERE id IN (?)", [
      userIds,
    ]);
    res.status(200).json({ message: "Users blocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/unblock-users", async (req, res) => {
  const { userIds } = req.body;

  try {
    await db.query("UPDATE users SET status = 'active' WHERE id IN (?)", [
      userIds,
    ]);
    res.status(200).json({ message: "Users unblocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/delete-users", async (req, res) => {
  const { userIds } = req.body;

  try {
    await db.query("DELETE FROM users WHERE id IN (?)", [userIds]);
    res.status(200).json({ message: "Users deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
