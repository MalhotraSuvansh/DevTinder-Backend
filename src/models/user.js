const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minLength: [2, "First name must be at least 2 characters"],
      maxLength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol",
          );
        }
      },
    },
    age: {
      type: Number,
      min: [18, "You must be at least 18 years old"],
      max: [100, "Age cannot exceed 100"],
    },
    gender: {
      type: String,
      lowercase: true,
      trim: true,
      // Using enum (or custom validate) restricts allowed values cleanly
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not a valid gender type",
      },
    },
    photoUrl: {
      type: String,
      trim: true,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      trim: true,
      default: "Hey there! I am a developer on DevTinder.",
      maxLength: [300, "About section cannot exceed 300 characters"],
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 15) {
          throw new Error("You cannot add more than 15 skills");
        }
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
