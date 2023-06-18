import Obj from "mongodb";
import mongoose from "mongoose";

const mongoURL =
  "mongodb+srv://venki31:venki31@cluster0.rk62fcu.mongodb.net/?retryWrites=true&w=majority";

function createConnection() {
  const params = {
    useNewURLParser: true,
    useUnifiedTopology: true,
  };
  mongoose.connect(mongoURL, params);
  console.log("Mongo connected Sucessfully");
}

export var ObjectId = Obj.ObjectId;
export { createConnection };
