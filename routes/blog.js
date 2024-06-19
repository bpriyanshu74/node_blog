const express = require("express");
const Blog = require("../models/blog");
const multer = require("multer");
const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/`);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new-blog", (req, res) => {
  return (
    res.render("addNewBlog"),
    {
      user: req.user,
    }
  );
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    backgroundImage: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  return res.render("blog", {
    user: req.user,
    blog,
  });
});

module.exports = router;
