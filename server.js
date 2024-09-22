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

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "https://task-04-wine.vercel.app",
  "http://localhost:3000",
];

// neet to test => trobles with cors

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/register", (req, res) => {
  res.redirect("/api/auth/register");
});

app.get("/login", (req, res) => {
  res.redirect("/api/auth/login");
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
    await db.query("SELECT 1 AS test_query");
    console.log("Database connected successfully");
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
