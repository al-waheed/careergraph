import express from "express";
import cors from "cors";
import jobsRouter from "./routes/jobs.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
  }),
);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ message: "careerGraph API is running" });
});

app.use("/api/jobs", jobsRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});