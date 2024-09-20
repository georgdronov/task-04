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

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, 
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(`${process.env.REACT_APP_API_URL}/api/auth`, authRoutes);
app.use(`${process.env.REACT_APP_API_URL}/api`, userRoutes);
app.use(`${process.env.REACT_APP_API_URL}/api/admin`, adminRoutes);

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
    await pool.getConnection();
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
