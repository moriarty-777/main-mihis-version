import dotenv from "dotenv";
dotenv.config();

console.log("MONGO_URI: ", process.env.MONGO_URI);
import express from "express";
import path from "path";
import cors from "cors";
import childRouter from "./routers/child.router";
import userRouter from "./routers/user.router";
import motherRouter from "./routers/mother.router";
import { dbConnect } from "./configs/database.config";

dbConnect();

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200", "http://your-deployment-domain.com"], // Add your deployment domain here
  })
);

// API routes
app.use("/api", childRouter);
app.use("/api/users", userRouter);
app.use("/api/mother", motherRouter);

// Serve static files
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
