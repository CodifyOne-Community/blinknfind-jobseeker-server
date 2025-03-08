const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { collection: "login_info", versionKey: false } // Disable `__v`
);

module.exports = ItemSchema;
