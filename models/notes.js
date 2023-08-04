import mongoose, { Mongoose } from "mongoose";

const { ObjectId } = mongoose.Schema;
const noteSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  code: {
    type: String,
  },
  tags: {
    type: String,
  },
  views: {
    type: Number,
  },
  answers: {
    type: [Object],
    default: [],
  },
  user: {
    type: ObjectId,
    ref: "user",
  },
});

const Notes = mongoose.model("notes", noteSchema);
export { Notes };
