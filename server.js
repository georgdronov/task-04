const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/adminRoutes");
const authenticateToken = require("./authMiddleware");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/api/auth/check-auth", authenticateToken, (req, res) => {
  res.json({ isAuthenticated: true });
});

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);

db.getConnection()
  .then(() => console.log("Connected to the MySQL database"))
  .catch((err) =>
    console.error("Error connecting to the database:", err.message)
  );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
