const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send("Get API call");
});

app.post("/user", (req, res) => {
  res.send("Post API call");
});

app.delete("/user", (req, res) => {
  res.send("Delete API call");
});

app.use("/", (req, res) => {
  res.send("Default address");
});

app.listen(3000, () => {
  console.log("Server is listening successfully on the port 3000...");
});
