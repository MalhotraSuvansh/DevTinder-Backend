require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error Saving the user:" + err.message);
  }
});

//get user by email
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await User.find({ email: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//Feed API - get all users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//Delete a user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//update data of the user
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  res.send("User updated successfully");
  try {
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
  } catch (err) {
    res.status(400).send("Update failed:" + err.message);
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
