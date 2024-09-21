const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./db");
dotenv.config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(cookieParser());
app.use(express.json());

app.get("/register", (req, res) => {
  res.redirect("/api/auth/register");
});

app.get("/login", (req, res) => {
  res.redirect("/api/auth/login");
});

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "https://task-04-wine.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

async function initializeServer() {
  try {
    await testDatabaseConnection();
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error("Error initializing server:", err.message);
    process.exit(1);
  }
}

async function testDatabaseConnection() {
  try {
    try {
      await db.query("SELECT 1 AS test_query");
      console.log("Database connected successfully");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.error("Error executing test query:", err.message);
    throw err;
  }
}

initializeServer();

app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});
