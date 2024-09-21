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
  host: "autorack.proxy.rlwy.net",
  user: "root",
  password: "MvXqbckWjgJwXznxgCtcGoCehDmPHapv",
  database: "railway", 
  port: 13225,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  multipleStatements: true,
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
  let retries = 3;

  while (retries > 0) {
    try {
      const connection = await pool.getConnection();
      console.log("Connected to the MySQL database");

      await testDatabaseConnection();

      app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
      });

      return;
    } catch (err) {
      console.error("Error connecting to the database:", err.message);

      if (err.code === "ETIMEDOUT") {
        retries--;
        console.warn(
          "Connection timed out, retrying...",
          retries,
          "attempts remaining"
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        process.exit(1);
      }
    }
  }

  console.error("Failed to connect to database after retries. Exiting.");
  process.exit(1);
}

initializeServer();

app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});
