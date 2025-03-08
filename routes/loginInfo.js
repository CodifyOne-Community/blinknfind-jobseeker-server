const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userInfoSchema = require("../models/loginInfo"); // Import only the schema

// Middleware to ensure req.db is available
router.use((req, res, next) => {
  if (!req.db) {
    return res.status(500).json({ error: "Database connection not available" });
  }
  next();
});

// Get model dynamically using the imported schema
const getUserModel = (db) => db.model("login_info", userInfoSchema);

// Create an item
router.post("/", async (req, res) => {
  try {
    const UserModel = getUserModel(req.db);
      console.log(req.body);
    // Validate request body against the schema
    const newItem = new UserModel(req.body);
    await newItem.validate(); // Ensures data meets schema requirements

    // Check if the email already exists
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser) {
      // Email exists, return the existing user's ID
      return res.status(200).json({ message: "Email already exists", id: existingUser._id });
    }

    // Save the new user if validation passes and email is unique
    const savedItem = await newItem.save();
    
    res.status(201).json({ message: "User created successfully", id: savedItem._id });
  } catch (error) {
    // Catch and return validation errors
    res.status(400).json({ error: error.message });
  }
});




// Read all items
router.get("/", async (req, res) => {
  try {
    const UserModel = getUserModel(req.db);
    const items = await UserModel.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an item
router.put("/:id", async (req, res) => {
  try {
    const UserModel = getUserModel(req.db);
    const updatedItem = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an item
router.delete("/:id", async (req, res) => {
  try {
    const UserModel = getUserModel(req.db);
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
