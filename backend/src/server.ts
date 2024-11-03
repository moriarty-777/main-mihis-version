import dotenv from "dotenv";
dotenv.config();

console.log("MONGO_URI: ", process.env.MONGO_URI);
import express from "express";
import path from "path";
import cors from "cors";
import cron from "node-cron"; // Import node-cron for scheduling
import childRouter from "./routers/child.router";
import userRouter from "./routers/user.router";
import motherRouter from "./routers/mother.router";
import smsRouter, {
  sendDailyReminders,
  sendScheduledSMS,
} from "./routers/sendsms.router";
import { dbConnect } from "./configs/database.config";
import { ChildModel } from "./models/child.model";
import { SchedulingModel } from "./models/scheduling.model";

dbConnect();

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:4200",
      "http://mihis.tech",
      "https://mihis.tech",
    ], // Add your deployment domain here
  })
);

// API routes
app.use("/api", childRouter);
app.use("/api/users", userRouter);
app.use("/api/mother", motherRouter);
app.use("/api/sms", smsRouter); // Use the send SMS router

// Serve static files
const publicPath = path.join(__dirname, "../../mihis/htdocs/mihis.tech");
app.use(express.static(publicPath));

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Schedule a cron job for 4:11 PM Philippine Time
// cron.schedule(
//   "12 16 * * *",
//   () => {
//     console.log("This is a test log. The time is 4:11 PM Philippine Time.");
//   },
//   {
//     timezone: "Asia/Manila", // Set timezoasdne to Philippine Time
//   }
// );

// Schedule a daily cron job to send SMS reminders at 9:00 AM Philippine Time
// TODO: Working on schedule date FIXME:
// cron.schedule(
//   "19 16 * * *",
//   async () => {
//     console.log("Running daily SMS reminder job at 9:00 AM PHT...");
//     await sendDailyReminders(); // Call the daily reminders function
//     console.log("Daily SMS reminder job completed.");
//   },
//   {
//     timezone: "Asia/Manila", // Set timezone to Philippine Time
//   }
// );

// Schedule the cron job to run daily at 9:00 AM Philippine time
// In server.ts
cron.schedule(
  "45 9 * * *", // Adjusted for UTC to run at 9:00 AM Philippine Time
  async () => {
    console.log("Running daily SMS reminder job at 9:00 AM Philippine Time...");
    await sendDailyReminders(); // Call the daily reminders function
    console.log("Daily SMS reminder job completed.");
  },
  {
    timezone: "Asia/Manila", // Set timezone to Philippine Time
  }
);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
