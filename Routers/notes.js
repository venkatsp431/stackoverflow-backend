import { createConnection } from "../db.js";
import express from "express";
import { Notes } from "../models/notes.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const notes = await Notes.find().populate("user", "name email");
    if (!notes) {
      return res.status(400).json({ data: "no questions found" });
    }
    res.status(200).json({ data: notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.get("/myquestions", async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user._id }).populate(
      "user",
      "name email"
    );
    if (!notes) {
      return res.status(400).json({ data: "no questions found" });
    }
    res.status(200).json({ data: notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const notes = await new Notes({
      ...req.body,
      user: req.user._id,
    }).save();
    if (!notes) return res.status(400).json({ message: "Nothing received" });
    res.status(200).json({ data: notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "internal server error" });
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const updatedNotes = await Notes.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: req.body },
      { new: true }
    );
    if (!updatedNotes) {
      return res.status(400).json({ data: "Error in updating" });
    }
    res
      .status(200)
      .json({ message: "Updated Successfully", data: updatedNotes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ date: "Internal Server Error" });
  }
});

export const notesRouter = router;
