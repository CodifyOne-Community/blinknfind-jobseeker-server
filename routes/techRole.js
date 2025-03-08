const express = require("express");
const router = express.Router();
const getFormDataModel = require("../models/techRole"); // Import dynamic model
// Middleware to ensure req.db is available
router.use((req, res, next) => {
    if (!req.db) {
      return res.status(500).json({ error: "Database connection not available" });
    }
    next();
  });
  
  // Get model dynamically using the imported schema
  const getUserModel = (db) => db.model("tech_role", getFormDataModel);

// ✅ Create Form Data (POST /formdata)
router.post("/", async (req, res) => {
    try {
      const FormData = getUserModel(req.db); // Get dynamic model
  
      // Check if an entry with the given email already exists
      const existingEntry = await FormData.findOne({ email: req.body.email });
  
      if (existingEntry) {
        // Update the existing entry with new data
        const updatedEntry = await FormData.findByIdAndUpdate(
          existingEntry._id,
          req.body,
          { new: true, runValidators: true } // Ensure schema validation
        );
  
        return res.status(200).json({
          id: updatedEntry._id,
          message: "Entry updated successfully",
          data: updatedEntry,
        });
      }
  
      // If email does not exist, create a new entry
      const newEntry = new FormData(req.body);
      const savedEntry = await newEntry.save();
  
      res.status(201).json({
        id: savedEntry._id,
        message: "New entry saved successfully",
        data: savedEntry,
      });
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

// ✅ Get All Form Data (GET /formdata)
router.get("/", async (req, res) => {
  try {
    const FormData = getUserModel(req.db);
    const allEntries = await FormData.find();
    res.json(allEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Single Form Data by ID (GET /formdata/:id)
router.get("/:id", async (req, res) => {
  try {
    const FormData = getUserModel(req.db);
    const entry = await FormData.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Form Data by ID (PUT /formdata/:id)
router.put("/:id", async (req, res) => {
  try {
    const FormData = getUserModel(req.db);
    const updatedEntry = await FormData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEntry) return res.status(404).json({ message: "Entry not found" });
    res.json(updatedEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Delete Form Data by ID (DELETE /formdata/:id)
router.delete("/:id", async (req, res) => {
  try {
    const FormData = getUserModel(req.db);
    const deletedEntry = await FormData.findByIdAndDelete(req.params.id);
    if (!deletedEntry) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
