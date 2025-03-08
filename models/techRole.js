const mongoose = require("mongoose");

// Education Schema
const EducationSchema = new mongoose.Schema({
  institute: { type: String, required: true },
  course: { type: String, required: true },
  degree: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: false },
  cgpa: { type: String, required: true }
});

// Experience Schema
const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: false },
  current: { type: Boolean, required: false },
  description: { type: String, required: false }
});

// Main FormData Schema
const FormDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  skills: { type: [String], required: true },
  education: { type: [EducationSchema], required: true },
  experience: { type: [ExperienceSchema], required: true },
  professionalYOE: { type: Number, required: true },
  industry: { type: [String], required: true },
  resume: { type: String, required: true },
  linkedin: { type: String, required: true },
  github: { type: String, required: true },
  codingProfile: { type: String, required: true },
  portfolio: { type: String, required: false }
}, { collection: "tech_role", versionKey: false });


module.exports =  FormDataSchema;
