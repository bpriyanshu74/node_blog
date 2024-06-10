const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const userRoutes = require("./routes/user");
const mongoose = require("mongoose");

// express instance
const app = express();

// db connection
mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then((e) => console.log("db connected"));

// view engine setup for server-side-rendering
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middleware
app.use(express.urlencoded({ extended: false }));

// routes
app.get("/", (req, res) => {
  res.render("home");
});
app.use("/user", userRoutes);

// server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`);
});
