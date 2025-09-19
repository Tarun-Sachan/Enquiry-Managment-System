import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import enquiryRoutes from "./routes/enquiryRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/users", userRoutes);
app.get("/api/health", (req, res) => res.json({ status: "OK" }));


app.use("/api/enquiries", enquiryRoutes);


// DB Connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB Error:", err));

export default app;
