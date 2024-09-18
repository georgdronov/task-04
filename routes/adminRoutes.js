const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/block-users", async (req, res) => {
  const { userIds } = req.body;

  try {
    await db.query("UPDATE users SET status = 'blocked' WHERE id IN (?)", [userIds]);
    res.status(200).json({ message: "Users blocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/unblock-users", async (req, res) => {
  const { userIds } = req.body;

  try {
    await db.query("UPDATE users SET status = 'active' WHERE id IN (?)", [userIds]);
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
