import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const { ObjectId } = mongoose.Schema;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    Required: true,
    maxlength: 32,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  contact: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  notes: [
    {
      type: ObjectId,
      ref: "notes",
    },
  ],
});

const User = mongoose.model("user", userSchema);

const generateJWTtoken = function (id) {
  return jwt.sign({ id }, process.env.SECRETKEY);
};

export { User, generateJWTtoken };
