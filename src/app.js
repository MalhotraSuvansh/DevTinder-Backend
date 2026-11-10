require("dotenv").config();
const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const {
  validateSignUpData,
  validatePatchData,
  validateObjectId,
} = require("./utils/validation");

const app = express();

app.use(express.json());

// 1. Signup API
app.post("/signup", async (req, res) => {
  try {
    // Step 1: API-level validation
    validateSignUpData(req);

    // Step 2: Whitelist only safe fields (never pass raw req.body directly)
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      about,
      skills,
    });

    await user.save();
    res.status(201).send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email.trim())) {
      throw new Error("Please provide a valid email address");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login Successful!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// 2. Get user by email
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.email || req.query.email;

    if (!userEmail || !validator.isEmail(userEmail)) {
      return res.status(400).send("Please provide a valid email address");
    }

    const users = await User.find({ email: userEmail.toLowerCase().trim() });
    if (users.length === 0) {
      return res.status(404).send("User not found");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

// 3. Feed API - get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

// 4. Delete a user
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    validateObjectId(userId, "userId");

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Delete failed: " + err.message);
  }
});

// 5. Update user data
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;

    // Validate both the URL parameter and the request body before querying DB
    validateObjectId(userId, "userId");
    validatePatchData(req);

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Server is listening successfully on the port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected:", err.message);
  });
