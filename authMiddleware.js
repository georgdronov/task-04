const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);

    try {
      const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
        decoded.userId,
      ]);

      if (users.length === 0) {
        return res.sendStatus(404);
      }

      const user = users[0];

      if (user.status === "blocked") {
        return res.status(403).json({ message: "User is blocked" });
      } else if (user.status === "deleted") {
        return res.status(401).json({ message: "User is deleted" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });
};

module.exports = authenticateToken;
