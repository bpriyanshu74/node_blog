const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/auth");
const userSchema = new mongoose.Schema(
  {
    fullname: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      unique: true,
      type: String,
    },
    salt: {
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    profileImageUrl: {
      type: String,
      default: "/images.defaultUser.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await User.find({ email });
    if (!user) throw new Error("user not found");

    const salt = user[0].salt;
    const hashedPassword = user[0].password;
    const hashedPasswordToVerify = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== hashedPasswordToVerify)
      throw new Error("Incorrect Password");

    const token = createTokenForUser(user[0]);
    return token;
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
