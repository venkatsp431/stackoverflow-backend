import { createConnection } from "../db.js";
import express from "express";
import { Notes } from "../models/notes.js";
import { ObjectId } from "bson";
import isAuthenticated from "../Auth/auth.js";
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
router.get("/userquestions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userques = await Notes.find().populate("user", "name email _id");
    console.log(userques);
    if (!userques) return res.status(400).json({ data: "No data found" });
    const final = userques.filter((question) => {
      return question.user._id.equals(new ObjectId(id));
    });
    console.log(final);
    res.status(200).json({ data: final });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.put("/question/:id", async (req, res) => {
  try {
    const notes = await Notes.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("user", "name email");

    if (!notes) res.status(400).json({ data: "No data found" });
    // notes.views = views;
    res.status(200).json({ data: notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.get("/questions/:tags", async (req, res) => {
  try {
    const { tags } = req.params;
    const ques = await Notes.find();
    if (!ques || ques.length === 0)
      return res.status(400).json("No data found");
    const separatedTags = ques.map((qn) => qn?.tags);
    console.log(separatedTags);
    let taggedQues = [];
    for (let i = 0; i < separatedTags.length; i++) {
      if (separatedTags[i] === undefined) continue;
      let findTag = separatedTags[i].split(" ");
      if (findTag.includes(tags)) taggedQues.push(ques[i]);
    }

    res.status(200).json({ data: taggedQues, tags });
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

router.post("/add", isAuthenticated, async (req, res) => {
  try {
    const notes = await new Notes({
      ...req.body,
      user: req?.user?._id,
      views: 0,
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
// router.put("/edit/:id/answers", async (req, res) => {
//   try {
//     const updatedNotes = await Notes.findOneAndUpdate(
//       {
//         _id: req.params.id,
//       },
//       { $push: { answers: req.body } },
//       { new: true, upsert: true }
//     );
//     if (!updatedNotes) {
//       return res.status(400).json({ data: "Error in updating" });
//     }
//     res
//       .status(200)
//       .json({ message: "Updated Successfully", data: updatedNotes });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ date: "Internal Server Error" });
//   }
// });

router.post("/edit/:id/answers", async (req, res) => {
  const questionId = req.params.id;
  const { answer, anscode } = req.body;
  try {
    const question = await Notes.findById(questionId);

    question.answers.push({ answer: answer, anscode: anscode });

    await question.save();

    res
      .status(200)
      .json({ message: "Answer added successfully", data: question });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
});

router.get("/search", async (req, res) => {
  const { query } = req.query; // Assuming the search query is passed as a query parameter

  try {
    const notes = await Notes.find({
      $or: [
        { question: { $regex: query, $options: "i" } }, // Case-insensitive search on the 'name' field
        { tags: { $regex: query, $options: "i" } }, // Case-insensitive search on the 'description' field
      ],
    });

    res.json({ data: notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const notesRouter = router;
// Employeehierarchy.findByIdAndUpdate(employeeparent._id,
//     { "$push": { "childrens": employee._id } },
//     { "new": true, "upsert": true },
//     function (err, managerparent) {
//         if (err) throw err;
//         console.log(managerparent);
//     }
// );
