import { createConnection } from "../db.js";
import express from "express";
import { User, generateJWTtoken } from "../models/users.js";
import bcrypt from "bcrypt";
import { Notes } from "../models/notes.js";
import isAuthenticated from "../Auth/auth.js";
import { ObjectId } from "bson";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const users = await User.find().populate("notes", "question");
    if (!users) return res.status(400).json({ data: "empty" });
    res.status(200).json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ data: "User already Exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user = await new User({
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
    }).save();
    const token = generateJWTtoken(user._id);
    res.status(200).json({ message: "Successfully Loggedin", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ data: "User not found" });
    const password = await bcrypt.compare(req.body.password, user.password);
    if (!password)
      return res.status(400).json({ data: "Password Error. Please Try again" });
    const token = generateJWTtoken(user._id);

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    // const user = await User.findById(userId);

    const userques = await Notes.find().populate("user", "name email _id");

    if (!userques) return res.status(400).json({ data: "No data found" });
    const final = userques.filter((question) => {
      return question.user._id.equals(new ObjectId(userId));
    });

    res.status(200).json({ data: final });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/questions", async (req, res) => {
  try {
    const { id } = req.params;
    const userques = await User.aggregate([
      {
        $lookup: {
          from: "Notes",
          localField: "name",
          foreignField: "name",
          as: "User-questions",
        },
      },
    ]);
    if (!userques) return res.status(400).json({ data: "No data found" });
    res.status(200).json({ data: userques });
  } catch (error) {
    res.status(500).json({ data: "Internal Server Error" });
  }
});

export const userRouter = router;
