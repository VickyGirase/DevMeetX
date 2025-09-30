const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Cookie options: in production we must use SameSite=None and Secure for cross-site cookies
const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  // 8 hours expiry
  expires: new Date(Date.now() + 8 * 3600000),
  secure: isProd, // required for SameSite=None
  sameSite: isProd ? "None" : "Lax",
};

authRouter.post("/signup", async (req, res) => {
  try {
    
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, cookieOptions);

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, cookieOptions);
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { ...cookieOptions, expires: new Date(Date.now()) });
  res.send("Logout Successful!!");
});

module.exports = authRouter;
