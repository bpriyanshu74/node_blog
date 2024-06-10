const express = require("express");
const User = require("../models/user");
const { createHmac } = require("crypto");

const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const requiredUser = await User.find({ email });
  if (requiredUser) {
    const retrievedSalt = requiredUser[0].salt;
    const hashedPasswordToVerify = createHmac("sha256", retrievedSalt)
      .update(password)
      .digest("hex");
    if (requiredUser[0].password === hashedPasswordToVerify.toString()) {
      return res.redirect("/");
    }
    return res.redirect("/user/signup");
  }
  return res.redirect("/user/signup");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  await User.create({
    fullname,
    email,
    password,
  });
  return res.redirect("/");
});

module.exports = router;
