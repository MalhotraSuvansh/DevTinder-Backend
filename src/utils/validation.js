const validator = require("validator");
const mongoose = require("mongoose");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !firstName.trim()) {
    throw new Error("First name is required");
  }
  if (firstName.trim().length < 2 || firstName.trim().length > 50) {
    throw new Error("First name must be between 2 and 50 characters");
  }
  if (lastName && lastName.trim().length > 50) {
    throw new Error("Last name cannot exceed 50 characters");
  }
  if (!email || !validator.isEmail(email.trim())) {
    throw new Error("Please provide a valid email address");
  }
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
    );
  }
};

const validatePatchData = (req) => {
  const data = req.body;
  const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

  // 1. Reject empty body {}
  if (!data || Object.keys(data).length === 0) {
    throw new Error("Request body cannot be empty");
  }

  // 2. Check allowed fields
  const isUpdateAllowed = Object.keys(data).every((key) =>
    ALLOWED_UPDATES.includes(key),
  );
  if (!isUpdateAllowed) {
    throw new Error("Update not allowed on one or more provided fields");
  }

  // 3. API-level checks on specific fields if provided
  if (data.photoUrl && !validator.isURL(data.photoUrl)) {
    throw new Error("Invalid photo URL");
  }
  if (data.about && data.about.length > 300) {
    throw new Error("About section cannot exceed 300 characters");
  }
  if (data.skills) {
    if (!Array.isArray(data.skills)) {
      throw new Error("Skills must be an array of strings");
    }
    // Remove empty strings and duplicates automatically
    data.skills = [
      ...new Set(data.skills.map((s) => s.trim()).filter(Boolean)),
    ];
    if (data.skills.length > 15) {
      throw new Error("You can add a maximum of 15 skills");
    }
  }
};

const validateObjectId = (id, label = "ID") => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${label}`);
  }
};

module.exports = {
  validateSignUpData,
  validatePatchData,
  validateObjectId,
};
