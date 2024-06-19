const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkCookieForAuthentication } = require("./middleware/auth");

const Blog = require("./models/blog");
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
app.use(cookieParser());
app.use(checkCookieForAuthentication("token"));
app.use(express.static(path.resolve("./public")));

// routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

// server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`);
});
