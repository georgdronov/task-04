const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const authenticateTokenAndCheckStatus = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
      decoded.userId,
    ]);

    if (users.length === 0) return res.sendStatus(403);
    const user = users[0];

    console.log("User found:", user); // Добавьте лог здесь

    if (user.status === "blocked") {
      return res.status(403).json({ message: "User is blocked" });
    } else if (user.status === "deleted") {
      return res.status(403).json({ message: "User is deleted" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.sendStatus(401);
    }
    res.sendStatus(403);
  }
};

module.exports = authenticateTokenAndCheckStatus;
