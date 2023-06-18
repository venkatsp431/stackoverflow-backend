import mongoose, { Mongoose } from "mongoose";

const { ObjectId } = mongoose.Schema;
const noteSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
  },
  votes: {
    type: Number,
  },
  answers: {
    type: Number,
  },
  user: {
    type: ObjectId,
    ref: "user",
  },
});

const Notes = mongoose.model("notes", noteSchema);
export { Notes };
