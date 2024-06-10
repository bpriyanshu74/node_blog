const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

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

// userSchema.static("matchPassword", async function (email, password) {
//   const requiredUser = await User.find({ email });

//   if (!requiredUser) throw new Error("user not found");

//   const retrievedSalt = requiredUser[0].salt;
//   const hashedPasswordToVerify = createHmac("sha256", retrievedSalt)
//     .update(password)
//     .digest("hex");

//   if (requiredUser[0].password !== hashedPasswordToVerify.toString())
//     throw new Error("Incorrect Password");

//   return { requiredUser };
// });

const User = mongoose.model("user", userSchema);

module.exports = User;
