import Routes from "./routes/index.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB is connected"))
  .catch(() => console.log("MongoDB is not connected"));

app.use("/", Routes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`${PORT} has been listening`));
