const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

db.getConnection()
  .then(() => console.log("Connected to the MySQL database"))
  .catch((err) =>
    console.error("Error connecting to the database:", err.message)
  );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
