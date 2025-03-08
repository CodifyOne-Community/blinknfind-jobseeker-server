const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser");
const {connectDB, getDatabase}= require("./db");
const loginInfoRoutes = require("./routes/loginInfo");
const techRoleRoutes = require("./routes/techRole");
require("dotenv").config();

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const init = async () => {
  // Connect to MongoDB Cluster
  const db = await connectDB();

  // Switch to specific databases
  // const userInfo = getDatabase("user-info");
  // const applicants = getDatabase("applicants");

  console.log("Databases userinfo and applicants are ready to use.");

  // Middleware to attach the correct DB dynamically
app.use((req, res, next) => {
  const dbName = req.headers["db-name"];
  if (!dbName) {
    return res.status(400).json({ error: "Missing 'db-name' header" });
  }

  try {
    req.db = getDatabase(dbName); // Ensure it returns a valid database instance
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
  // Routes
  app.use("/loginInfo", loginInfoRoutes);
  app.use("/techRole", techRoleRoutes);
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

// Initialize DB and start server
init();
