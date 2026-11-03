require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Prerna",
    lastName: "Malhotra",
    email: "prernamalhotra846@gmail.com",
    password: "Sansupre@1",
  };

  const user = new User(userObj);

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error Saving the user:" + err.message);
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
    console.error("Database cannot be connected");
  });
