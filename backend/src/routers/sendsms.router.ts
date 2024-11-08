import { Router, Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { SchedulingModel } from "../models/scheduling.model";
import { ChildModel } from "../models/child.model";

dotenv.config();

const router = Router();

// Movider API credentials from .env file
const MOVIDER_API_KEY = process.env.MOVIDER_API_KEY || "";
const MOVIDER_API_SECRET = process.env.MOVIDER_API_SECRET || "";
const MOVIDER_BASE_URL =
  process.env.MOVIDER_BASE_URL || "https://api.movider.co/v1/sms";

// const transporter = nodemailer.createTransport({
//   service: "gmail", // You can use any email service provider
//   auth: {
//     user: process.env.GMAIL_USER, // Your email
//     pass: process.env.GMAIL_PASSWORD, // Your email password or app-specific password
//   },
// });

const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || "";

let transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your SMTP provider if not using Gmail
  port: 465, // For SSL, use 465. For TLS, use 587.
  secure: true, // true for SSL, false for TLS
  auth: {
    user: GMAIL_USER, // Your Gmail email or the SMTP user
    pass: GMAIL_PASSWORD, // Your Gmail app-specific password or SMTP password
  },
});

// Store OTPs in-memory for now (in production, use a database)
let otps: { [phoneNumber: string]: { otp: string; expiresAt: Date } } = {};

// Send OTP via Movider
/*router.post(
  "/sendOTP",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { to } = req.body; // Mobile number (in E.164 format, e.g., +639123456789)

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Set OTP expiration time (5 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    otps[to] = { otp, expiresAt };

    try {
      // Send OTP via SMS using Movider
      const response = await axios.post(
        MOVIDER_BASE_URL,
        new URLSearchParams({
          api_key: MOVIDER_API_KEY,
          api_secret: MOVIDER_API_SECRET,
          to: to,
          text: `Your MIHIS OTP code is: ${otp}`,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Movider expects form-encoded data
            Accept: "application/json",
          },
        }
      );

      res.status(200).send({
        message: "OTP sent successfully!",
        otp, // For testing purposes, remove this in production
        response: response.data,
      });
    } catch (error: any) {
      console.error(
        "Failed to send OTP:",
        error.response ? error.response.data : error.message
      );
      res
        .status(500)
        .send({ message: "Failed to send OTP", error: error.message });
    }
  })
);
*/

// Modify the sendOTP route to handle both email and phone number
router.post(
  "/sendOTP",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { to } = req.body; // Email or Mobile number

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Set OTP expiration time (5 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    otps[to] = { otp, expiresAt };

    if (to.includes("@")) {
      // Send OTP via email
      try {
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: to,
          subject: "Your MIHIS OTP Code",
          text: `Your MIHIS OTP code is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({
          message: "OTP sent to email successfully!",
          otp, // For testing purposes, remove this in production
        });
      } catch (error: any) {
        console.error("Failed to send OTP via email:", error.message);
        res.status(500).send({ message: "Failed to send OTP via email" });
      }
    } else {
      // Send OTP via SMS using Movider
      try {
        const response = await axios.post(
          MOVIDER_BASE_URL,
          new URLSearchParams({
            api_key: MOVIDER_API_KEY,
            api_secret: MOVIDER_API_SECRET,
            to: to,
            from: "CTCMIHIS",
            text: `Your MIHIS OTP code is: ${otp}`,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
          }
        );

        res.status(200).send({
          message: "OTP sent via SMS successfully!",
          otp, // For testing purposes, remove this in production
          response: response.data,
        });
      } catch (error: any) {
        console.error(
          "Failed to send OTP via SMS:",
          error.response ? error.response.data : error.message
        );
        res.status(500).send({
          message: "Failed to send OTP via SMS",
          error: error.message,
        });
      }
    }
  })
);

// Verify OTP
router.post(
  "/verifyOTP",
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { to, otp } = req.body;
      const storedOtp = otps[to];

      if (!storedOtp || new Date() > storedOtp.expiresAt) {
        res.status(400).send({ message: "OTP expired or not found" });
        return;
      }

      if (storedOtp.otp === otp) {
        res.status(200).send({ message: "OTP verified successfully!" });
      } else {
        res.status(400).send({ message: "Invalid OTP" });
      }
    }
  )
);

// Testing purposes: Send SMS
// Send SMS
router.post(
  "/sendSMS",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { to, text } = req.body; // Mobile number and message content

    try {
      const response = await axios.post(
        MOVIDER_BASE_URL,
        new URLSearchParams({
          api_key: MOVIDER_API_KEY,
          api_secret: MOVIDER_API_SECRET,
          to: to, // Your registered sender name (if required)
          text: text,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );

      res.status(200).send({
        message: "SMS sent successfully!",
        response: response.data,
      });
    } catch (error: any) {
      console.error(
        "Failed to send SMS:",
        error.response ? error.response.data : error.message
      );
      res
        .status(500)
        .send({ message: "Failed to send SMS", error: error.message });
    }
  })
);
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2); // Ensure two digits for month
  const day = ("0" + today.getDate()).slice(-2); // Ensure two digits for day
  return `${year}-${month}-${day}`;
}

export async function sendYearlyScheduleSMS(
  phoneNumber: string,
  child: any,
  schedules: any[],
  mother: any
) {
  const currentYear = new Date().getFullYear();

  // Filter schedules for the current year
  const yearlySchedules = schedules.filter((schedule) => {
    const scheduleYear = new Date(schedule.scheduleDate).getFullYear();
    return scheduleYear === currentYear;
  });

  // Format the schedule details
  const scheduleDetails = yearlySchedules
    .map((schedule) => {
      const scheduleDate = schedule.scheduleDate
        ? new Date(schedule.scheduleDate)
        : null;

      // Format date in Filipino with month name, e.g., "Nobyembre 12, 2024"
      const formattedDate = scheduleDate
        ? scheduleDate.toLocaleDateString("tl-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A";

      const type = schedule.scheduleType === "weighing" ? "Timbang" : "Bakuna";
      const vaccineName = schedule.vaccineName
        ? ` - ${schedule.vaccineName}`
        : "";
      const doseInfo =
        schedule.scheduleType === "vaccination" && schedule.doseNumber
          ? ` (Dose ${schedule.doseNumber})`
          : "";
      const description = schedule.weighingDescription || "";

      return `${formattedDate} - ${type}${vaccineName}${doseInfo} ${description}`.trim();
    })
    .join("\n");

  // Create a personalized and friendly message
  const message = `
Magandang Araw, Aling ${mother.firstName}! Ang iyong anak na si ${child.firstName} ${child.lastName} ay naka-schedule na sa mga araw na ito:

${scheduleDetails}

Tuloy-tuloy ang pagiging malusog at protektado ni baby ${child.firstName}!
`;

  // Check if the message content is empty
  const messageText = scheduleDetails.trim();
  if (messageText.length === 0) {
    console.error("SMS text content is empty.");
    return;
  }

  // Log the full message and its character count
  console.log("Message Content:\n", message);
  console.log("Character Count:", message.length);

  try {
    const response = await axios.post(
      MOVIDER_BASE_URL,
      new URLSearchParams({
        api_key: MOVIDER_API_KEY,
        api_secret: MOVIDER_API_SECRET,
        to: phoneNumber,
        from: "CTCMIHIS",
        text: message,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );
    console.log("Yearly schedule SMS sent successfully!", response.data);
  } catch (error: any) {
    console.error(
      "Failed to send yearly schedule SMS:",
      error.response ? error.response.data : error.message
    );
  }
}

// cron job TODO:
// Function to send SMS FIXME: Working on schedule date
function delay(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function sendScheduledSMS(phoneNumber: string, message: string) {
  try {
    const response = await axios.post(
      MOVIDER_BASE_URL,
      new URLSearchParams({
        api_key: MOVIDER_API_KEY,
        api_secret: MOVIDER_API_SECRET,
        to: phoneNumber,
        from: "CTCMIHIS",
        text: message,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );
    console.log("Scheduled SMS sent successfully!", response.data);
  } catch (error: any) {
    console.error(
      "Failed to send scheduled SMS:",
      error.response ? error.response.data : error.message
    );
  }
}

// sendDailyReminders function in smsRouter.ts or where it's defined
// export async function sendDailyReminders() {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Set to start of the day

//   const reminderDate = new Date(today);
//   reminderDate.setDate(reminderDate.getDate() + 2); // Set reminder for 2 days ahead

//   const reminderDateStart = new Date(reminderDate);
//   reminderDateStart.setHours(0, 0, 0, 0);
//   const reminderDateEnd = new Date(reminderDate);
//   reminderDateEnd.setHours(23, 59, 59, 999);

//   try {
//     // Step 1: Reset notificationSent for missed schedules with rescheduleDate
//     const resetResult = await SchedulingModel.updateMany(
//       {
//         scheduleDate: { $lt: today }, // Past schedules
//         status: false, // Schedule was missed
//         notificationSent: true, // Previous notification was sent
//         rescheduleDate: { $exists: true }, // RescheduleDate is set
//       },
//       { $set: { notificationSent: false } } // Reset for reschedule reminder
//     );
//     console.log("Reset notificationSent for missed schedules:", resetResult);

//     // Step 2: Find and send reminders for 2 days before scheduleDate or rescheduleDate
//     const schedulesToRemind = await SchedulingModel.find({
//       $or: [
//         { scheduleDate: { $gte: reminderDateStart, $lt: reminderDateEnd } },
//         { rescheduleDate: { $gte: reminderDateStart, $lt: reminderDateEnd } },
//       ],
//       notificationSent: false, // Only unsent reminders
//       status: false, // Event has not been completed
//     });

//     for (const schedule of schedulesToRemind) {
//       const {
//         motherPhoneNumber,
//         childId,
//         scheduleDate,
//         rescheduleDate,
//         vaccineName,
//         doseNumber,
//         scheduleType,
//         location,
//       } = schedule;

//       // Fetch child information (for name, mother, etc.)
//       const child = await ChildModel.findById(childId).populate("motherId");
//       const childName = child
//         ? `${child.firstName} ${child.lastName}`
//         : "iyong anak";
//       const motherName =
//         child && child.motherId ? child.motherId.firstName : "Nanay";

//       // Format the date for the reminder message in Filipino
//       const reminderDate = rescheduleDate || scheduleDate;
//       const options: Intl.DateTimeFormatOptions = {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       };
//       const formattedDate = reminderDate.toLocaleDateString("tl-PH", options);

//       // Construct the personalized message with "Aling [Mother's First Name]" and "Bakuna"
//       let message = `Magandang Araw, Aling ${motherName}! Ang iyong anak na si ${childName} ay naka-schedule para sa ${
//         scheduleType === "vaccination" ? "Bakuna" : "Timbang"
//       } sa ${formattedDate}.
// Maaari lamang na bumisita sa ${location} para siguradong malusog at laging handa si baby laban sa sakit!`;

//       // Include vaccine details if it's a vaccination and they exist
//       if (scheduleType === "vaccination") {
//         if (vaccineName) {
//           message += `\n\nBakuna: ${vaccineName}`;
//         }
//         if (doseNumber) {
//           message += `, Dose: ${doseNumber}`;
//         }
//       }

//       console.log("Sending SMS with message:", message);

//       // Send the SMS
//       await sendScheduledSMS(motherPhoneNumber, message);
//       await delay(1000);

//       // Mark the reminder as sent
//       schedule.notificationSent = true;
//       schedule.notificationDate = new Date();
//       await schedule.save();
//     }
//   } catch (error) {
//     console.error("Error running daily SMS reminder job:", error);
//   }
// }
export async function sendDailyReminders() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminderDate = new Date(today);
  reminderDate.setDate(reminderDate.getDate() + 2); // Reminder for 2 days ahead

  const reminderDateStart = new Date(reminderDate);
  reminderDateStart.setHours(0, 0, 0, 0);
  const reminderDateEnd = new Date(reminderDate);
  reminderDateEnd.setHours(23, 59, 59, 999);

  try {
    // Step 1: Reset `notificationSent` for missed schedules with rescheduleDate
    await SchedulingModel.updateMany(
      {
        scheduleDate: { $lt: today },
        status: false, // Missed schedule
        notificationSent: true,
        rescheduleDate: { $exists: true },
      },
      { $set: { notificationSent: false } }
    );

    // Step 2: Find and send reminders for 2 days before `scheduleDate` or `rescheduleDate`
    const schedulesToRemind = await SchedulingModel.find({
      $or: [
        { scheduleDate: { $gte: reminderDateStart, $lt: reminderDateEnd } },
        { rescheduleDate: { $gte: reminderDateStart, $lt: reminderDateEnd } },
      ],
      notificationSent: false,
      status: false,
    });

    for (const schedule of schedulesToRemind) {
      const {
        motherPhoneNumber,
        childId,
        scheduleDate,
        rescheduleDate,
        vaccineName,
        doseNumber,
        scheduleType,
        location,
      } = schedule;

      const child = await ChildModel.findById(childId).populate("motherId");
      const childName = child
        ? `${child.firstName} ${child.lastName}`
        : "iyong anak";
      const motherName = child?.motherId?.firstName || "Nanay";

      const reminderDate = scheduleDate || rescheduleDate;
      // FIXME: Make the reminder date the schedule date if the date today is not yet in the schedule date and if the scheduledate is past and the status is false make the reminder date the reschedule date
      const formattedDate = reminderDate.toLocaleDateString("tl-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      let message = `Magandang Araw, Aling ${motherName}! Ang iyong anak na si ${childName} ay naka-schedule para sa ${
        scheduleType === "vaccination" ? "Bakuna" : "Timbang"
      } sa ${formattedDate}. Maaari lamang na bumisita sa ${location} para siguradong malusog at laging handa si baby laban sa sakit!`;

      if (scheduleType === "vaccination" && vaccineName) {
        message += `\n\nBakuna: ${vaccineName}, Dose: ${doseNumber || "1"}`;
      }

      console.log("Sending SMS with message:", message);
      await sendScheduledSMS(motherPhoneNumber, message);
      await delay(1000);

      schedule.notificationSent = true;
      schedule.notificationDate = new Date();
      await schedule.save();
    }
  } catch (error) {
    console.error("Error running daily SMS reminder job:", error);
  }
}

// TODO: Reminder date fixed
/*

export async function sendDailyReminders() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminderDate = new Date(today);
  reminderDate.setDate(reminderDate.getDate() + 2); // Reminder for 2 days ahead

  const reminderDateStart = new Date(reminderDate);
  reminderDateStart.setHours(0, 0, 0, 0);
  const reminderDateEnd = new Date(reminderDate);
  reminderDateEnd.setHours(23, 59, 59, 999);

  try {
    // Step 1: Reset `notificationSent` for missed schedules with rescheduleDate
    await SchedulingModel.updateMany(
      {
        scheduleDate: { $lt: today },
        status: false, // Missed schedule
        notificationSent: true,
        rescheduleDate: { $exists: true },
      },
      { $set: { notificationSent: false } }
    );

    // Step 2: Find and send reminders for 2 days before `scheduleDate` or `rescheduleDate`
    const schedulesToRemind = await SchedulingModel.find({
      $or: [
        { scheduleDate: { $gte: reminderDateStart, $lt: reminderDateEnd } },
        { rescheduleDate: { $gte: reminderDateStart, $lt: reminderDateEnd } },
      ],
      notificationSent: false,
      status: false,
    });

    for (const schedule of schedulesToRemind) {
      const {
        motherPhoneNumber,
        childId,
        scheduleDate,
        rescheduleDate,
        vaccineName,
        doseNumber,
        scheduleType,
        location,
      } = schedule;

      const child = await ChildModel.findById(childId).populate("motherId");
      const childName = child
        ? `${child.firstName} ${child.lastName}`
        : "iyong anak";
      const motherName = child?.motherId?.firstName || "Nanay";

      // Determine which date to use for the reminder
      let reminderDate;
      if (scheduleDate && today < new Date(scheduleDate)) {
        // If scheduleDate is in the future, use it for the reminder
        reminderDate = scheduleDate;
      } else if (scheduleDate && today > new Date(scheduleDate) && status === false && rescheduleDate) {
        // If scheduleDate is missed and there is a rescheduleDate, use rescheduleDate
        reminderDate = rescheduleDate;
      }

      // Only proceed if reminderDate is defined
      if (reminderDate) {
        const formattedDate = reminderDate.toLocaleDateString("tl-PH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        let message = `Magandang Araw, Aling ${motherName}! Ang iyong anak na si ${childName} ay naka-schedule para sa ${
          scheduleType === "vaccination" ? "Bakuna" : "Timbang"
        } sa ${formattedDate}. Maaari lamang na bumisita sa ${location} para siguradong malusog at laging handa si baby laban sa sakit!`;

        if (scheduleType === "vaccination" && vaccineName) {
          message += `\n\nBakuna: ${vaccineName}, Dose: ${doseNumber || "1"}`;
        }

        console.log("Sending SMS with message:", message);
        await sendScheduledSMS(motherPhoneNumber, message);
        await delay(1000);

        // Mark the notification as sent
        schedule.notificationSent = true;
        schedule.notificationDate = new Date();
        await schedule.save();
      } else {
        console.log("No message sent: conditions not met for sending a reminder.");
      }
    }
  } catch (error) {
    console.error("Error running daily SMS reminder job:", error);
  }
}

*/

// Send notification upon scheduloing

export default router;
