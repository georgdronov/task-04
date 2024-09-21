const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mysql = require("mysql2/promise");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

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

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000, 
});

async function testDatabaseConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 AS test_query");
    console.log("Database test query result:", rows);
  } catch (err) {
    console.error("Error executing test query:", err.message);
  }
}

async function initializeServer() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the MySQL database");

    await testDatabaseConnection();

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  }
}

initializeServer();

app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.use("/api/auth", (req, res, next) => {
  res.on("finish", () => {
    console.log(
      `Request to ${req.url} completed with status ${res.statusCode}`
    );
  });
  next();
});
