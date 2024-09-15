const db = require("./db");

db.query("SELECT 1 + 1 AS result", (err, results) => {
  if (err) {
    console.error("Error executing query:", err.message);
    return;
  }

  console.log("Database connected successfully. Test query result:", results);
  
  // Исправляем вызов db.end()
  db.end();
});
