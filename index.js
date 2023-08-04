import express from "express";
import dotenv from "dotenv";
import { createConnection } from "./db.js";
import cors from "cors";
import { userRouter } from "./Routers/users.js";
import { notesRouter } from "./Routers/notes.js";
import isAuthenticated from "./Auth/auth.js";

dotenv.config();
createConnection();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/notes", notesRouter);

app.listen(PORT, () => console.log(`Server running in localhost:${PORT}`));
