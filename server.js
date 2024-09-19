const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Pool } = require("pg");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/api/auth/check-auth", (req, res) => {
  res.json({ isAuthenticated: true });
});

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  ssl: {
    rejectUnauthorized: false, 
  },
});

pool
  .connect()
  .then(() => {
    console.log("Connected to the PostgreSQL database");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);
