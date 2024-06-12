const express = require("express");
const Blog = require("../models/blog");
const router = express.Router();

router.get("/add-new-blog", (req, res) => {
  return res.render("addNewBlog");
});

router.post("/add-new-blog", async (req, res) => {
  console.log(req.body);
  const { upload, title, body } = req.body;
  try {
    await Blog.create({
      title: title,
      body: body,
      backgroundImage: upload,
    });
  } catch (err) {
    throw new Error(err);
  }
  return res.json({ message: "new blog created" });
});

module.exports = router;
