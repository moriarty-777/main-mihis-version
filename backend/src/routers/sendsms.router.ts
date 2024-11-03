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
  schedules: any[]
) {
  const currentYear = new Date().getFullYear();

  // Filter schedules for the current year
  const yearlySchedules = schedules.filter((schedule) => {
    // console.log("Processing Schedule:", schedule); // Log each schedule details
    const scheduleYear = new Date(schedule.scheduleDate).getFullYear();
    return scheduleYear === currentYear;
  });
  // Format the schedule details
  const scheduleDetails = yearlySchedules
    .map((schedule) => {
      const date = schedule.scheduleDate
        ? schedule.scheduleDate.toISOString().split("T", 1)[0]
        : "N/A";
      const type =
        schedule.scheduleType === "weighing" ? "Weighing" : "Vaccination";
      const vaccineName = schedule.vaccineName || "";
      const doseInfo =
        schedule.scheduleType === "vaccination" && schedule.doseNumber
          ? `dose ${schedule.doseNumber}`
          : ""; // Include dose only if type is Vaccination
      const description = schedule.weighingDescription || "";

      return `${date}: ${type} ${vaccineName} ${doseInfo} ${description}`.trim();
    })
    .join("\n");
  // console.log("Filtered Yearly Schedules:", yearlySchedules);
  const message = `This Year Schedule for your child ${child.firstName} ${child.lastName}:\n${scheduleDetails}`;
  // const message = `This Year Schedule for your child Efraim Gondraneos is the`;
  console.log("Message Content23:\n", message);
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

// TODO:
// Hard-coded test date (for example, today’s date or a future date for testing)
// const TEST_SCHEDULE_DATE = "2024-11-03"; // Replace this with a nearby date for testing

// async function sendScheduledSMS(phoneNumber: string, message: string) {
//   try {
//     const response = await axios.post(
//       process.env.MOVIDER_BASE_URL || "https://api.movider.co/v1/sms",
//       new URLSearchParams({
//         api_key: process.env.MOVIDER_API_KEY || "",
//         api_secret: process.env.MOVIDER_API_SECRET || "",
//         to: phoneNumber,
//         from: "CTCMIHIS",
//         text: message,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Accept: "application/json",
//         },
//       }
//     );
//     console.log("Scheduled SMS sent successfully!", response.data);
//   } catch (error: any) {
//     console.error(
//       "Failed to send scheduled SMS:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

// // Main function to send SMS on schedule date match
// export async function sendSMSBasedOnSchedule(req: Request, res: Response) {
//   const { phoneNumber, child } = req.body;

//   // Mocked schedule data for testing
//   const schedules = [
//     {
//       scheduleDate: new Date(TEST_SCHEDULE_DATE), // Hard-coded test date
//       scheduleType: "weighing",
//       location: "Barangay Health Center",
//       vaccineName: "",
//       doseNumber: "",
//       weighingDescription: "Weighing Schedule",
//     },
//   ];

//   const today = new Date().toISOString().split("T", 1)[0]; // Format today's date as YYYY-MM-DD

//   schedules.forEach((schedule) => {
//     const scheduleDate = schedule.scheduleDate.toISOString().split("T", 1)[0];
//     if (scheduleDate === today) {
//       const message = `Reminder: Your child ${child.firstName} ${child.lastName} has a scheduled ${schedule.scheduleType} at ${schedule.location} on ${scheduleDate}.`;
//       console.log("Sending SMS with message:", message);
//       sendScheduledSMS(phoneNumber, message);
//     }
//   });

//   res.send({ message: "Checked and sent SMS based on schedule if matched." });
// }
// TODO:

// FIXME:
// router.post(
//   "/testSendSMS",
//   expressAsyncHandler(async (req: Request, res: Response) => {
//     // Hardcoded test child data
//     const testChild = {
//       firstName: "TestChildFirstName",
//       lastName: "TestChildLastName",
//     };

//     // Hardcoded phone number for testing
//     const testPhoneNumber = "639683799097"; // Replace with a valid number for testing

//     // Call the sendSMSBasedOnSchedule function with hardcoded data
//     await sendSMSBasedOnSchedule(
//       {
//         body: { phoneNumber: testPhoneNumber, child: testChild },
//       } as Request,
//       res
//     );
//   })
// );

// FIXME:

// TODO: REAL DATA
// async function sendScheduledSMS(phoneNumber: string, message: string) {
//   try {
//     const response = await axios.post(
//       process.env.MOVIDER_BASE_URL || "https://api.movider.co/v1/sms",
//       new URLSearchParams({
//         api_key: process.env.MOVIDER_API_KEY || "",
//         api_secret: process.env.MOVIDER_API_SECRET || "",
//         to: phoneNumber,
//         from: "CTCMIHIS",
//         text: message,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Accept: "application/json",
//         },
//       }
//     );
//     console.log("Scheduled SMS sent successfully!", response.data);
//   } catch (error: any) {
//     console.error(
//       "Failed to send scheduled SMS:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

// export async function sendSMSBasedOnRealSchedule(req: Request, res: Response) {
//   const { phoneNumber, childId } = req.body;
//   const today = new Date().toISOString().split("T", 1)[0]; // Format today's date as YYYY-MM-DD

//   try {
//     // Query the database for schedules for this child that match today’s date and have not yet been sent
//     const schedules = await SchedulingModel.find({
//       childId,
//       scheduleDate: {
//         $gte: new Date(today), // Start of today
//         $lt: new Date(new Date().setDate(new Date().getDate() + 1)), // Start of tomorrow
//       },
//       notificationSent: false, // Only fetch schedules where SMS has not been sent
//     });

//     // Group schedules by type and construct a single message per type
//     const vaccinations: string[] = [];
//     let weighingScheduled = false;
//     let location = "";

//     for (const schedule of schedules) {
//       const scheduleDate = schedule.scheduleDate.toISOString().split("T", 1)[0];
//       location = schedule.location || "designated location"; // Store location for the message

//       if (schedule.scheduleType === "vaccination") {
//         const vaccineInfo = schedule.vaccineName
//           ? `${schedule.vaccineName}`
//           : "vaccine";
//         const doseInfo = schedule.doseNumber
//           ? `dose ${schedule.doseNumber}`
//           : "";
//         vaccinations.push(`${vaccineInfo} ${doseInfo}`.trim());
//       } else if (schedule.scheduleType === "weighing") {
//         weighingScheduled = true;
//       }
//     }

//     // Construct the SMS message
//     let message = `Reminder: Your child has a scheduled `;
//     if (weighingScheduled) {
//       message += `weighing at ${location} on ${today}. `;
//     }
//     if (vaccinations.length > 0) {
//       const vaccinesList = vaccinations.join(", ");
//       message += `vaccination(s) (${vaccinesList}) at ${location} on ${today}.`;
//     }

//     // Only send SMS if there is a scheduled weighing or vaccinations
//     if (weighingScheduled || vaccinations.length > 0) {
//       console.log("Sending SMS with message:", message);
//       await sendScheduledSMS(phoneNumber, message); // Send SMS

//       // Update the `notificationSent` field for all schedules that were sent
//       await SchedulingModel.updateMany(
//         {
//           childId,
//           scheduleDate: {
//             $gte: new Date(today),
//             $lt: new Date(new Date().setDate(new Date().getDate() + 1)),
//           },
//         },
//         {
//           $set: {
//             notificationSent: true,
//             notificationDate: new Date(),
//             notificationContent: message,
//           },
//         }
//       );
//       console.log("Updated schedules to mark SMS as sent.");
//     }

//     res.send({
//       message: "Checked and sent SMS based on real schedule if matched.",
//     });
//   } catch (error: any) {
//     console.error("Failed to retrieve or update schedules:", error.message);
//     res.status(500).send({ message: "Error fetching or updating schedules." });
//   }
// }

// router.post(
//   "/sendRealScheduleSMS",
//   expressAsyncHandler(async (req: Request, res: Response) => {
//     await sendSMSBasedOnRealSchedule(req, res);
//   })
// );

// FIXME: 2 days before schedule date
// async function sendScheduledSMS(phoneNumber: string, message: string) {
//   try {
//     const response = await axios.post(
//       process.env.MOVIDER_BASE_URL || "https://api.movider.co/v1/sms",
//       new URLSearchParams({
//         api_key: process.env.MOVIDER_API_KEY || "",
//         api_secret: process.env.MOVIDER_API_SECRET || "",
//         to: phoneNumber,
//         from: "CTCMIHIS",
//         text: message,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Accept: "application/json",
//         },
//       }
//     );
//     console.log("Scheduled SMS sent successfully!", response.data);
//   } catch (error: any) {
//     console.error(
//       "Failed to send scheduled SMS:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

// export async function sendSMSBasedOnRealSchedule(req: Request, res: Response) {
//   const { phoneNumber, childId } = req.body;

//   // Calculate the reminder date (2 days from today)
//   const reminderDate = new Date();
//   reminderDate.setDate(reminderDate.getDate() + 2);

//   // Define the start and end of the reminder date
//   const reminderDateStart = new Date(reminderDate);
//   reminderDateStart.setHours(0, 0, 0, 0);
//   const reminderDateEnd = new Date(reminderDate);
//   reminderDateEnd.setHours(23, 59, 59, 999);

//   try {
//     // Query the database for schedules matching the reminder date and not yet sent
//     const schedules = await SchedulingModel.find({
//       childId,
//       scheduleDate: {
//         $gte: reminderDateStart,
//         $lt: reminderDateEnd,
//       },
//       notificationSent: false, // Only fetch unsent schedules
//     });

//     // Prepare the SMS message
//     const vaccinations: string[] = [];
//     let weighingScheduled = false;
//     let location = "";

//     for (const schedule of schedules) {
//       const scheduleDate = schedule.scheduleDate.toISOString().split("T", 1)[0];
//       location = schedule.location || "designated location";

//       if (schedule.scheduleType === "vaccination") {
//         const vaccineInfo = schedule.vaccineName
//           ? `${schedule.vaccineName}`
//           : "vaccine";
//         const doseInfo = schedule.doseNumber
//           ? `dose ${schedule.doseNumber}`
//           : "";
//         vaccinations.push(`${vaccineInfo} ${doseInfo}`.trim());
//       } else if (schedule.scheduleType === "weighing") {
//         weighingScheduled = true;
//       }
//     }

//     // Construct the message based on the schedule type
//     let message = `Reminder: Your child has a scheduled `;
//     if (weighingScheduled) {
//       message += `weighing at ${location} on ${
//         reminderDate.toISOString().split("T", 1)[0]
//       }. `;
//     }
//     if (vaccinations.length > 0) {
//       const vaccinesList = vaccinations.join(", ");
//       message += `vaccination(s) (${vaccinesList}) at ${location} on ${
//         reminderDate.toISOString().split("T", 1)[0]
//       }.`;
//     }

//     // Only send SMS if there's a relevant schedule
//     if (weighingScheduled || vaccinations.length > 0) {
//       console.log("Sending SMS with message:", message);
//       await sendScheduledSMS(phoneNumber, message); // Send the SMS

//       // Update the `notificationSent` field for the sent schedules
//       await SchedulingModel.updateMany(
//         {
//           childId,
//           scheduleDate: {
//             $gte: reminderDateStart,
//             $lt: reminderDateEnd,
//           },
//         },
//         {
//           $set: {
//             notificationSent: true,
//             notificationDate: new Date(),
//             notificationContent: message,
//           },
//         }
//       );
//       console.log("Updated schedules to mark SMS as sent.");
//     }

//     res.send({
//       message: "Checked and sent SMS based on real schedule if matched.",
//     });
//   } catch (error: any) {
//     console.error("Failed to retrieve or update schedules:", error.message);
//     res.status(500).send({ message: "Error fetching or updating schedules." });
//   }
// }

// router.post(
//   "/sendRealScheduleSMS",
//   expressAsyncHandler(async (req: Request, res: Response) => {
//     await sendSMSBasedOnRealSchedule(req, res);
//   })
// );

// FIXME: include child first and last name Current working
// async function sendScheduledSMS(phoneNumber: string, message: string) {
//   try {
//     const response = await axios.post(
//       process.env.MOVIDER_BASE_URL || "https://api.movider.co/v1/sms",
//       new URLSearchParams({
//         api_key: process.env.MOVIDER_API_KEY || "",
//         api_secret: process.env.MOVIDER_API_SECRET || "",
//         to: phoneNumber,
//         from: "CTCMIHIS",
//         text: message,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Accept: "application/json",
//         },
//       }
//     );
//     console.log("Scheduled SMS sent successfully!", response.data);
//   } catch (error: any) {
//     console.error(
//       "Failed to send scheduled SMS:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

// export async function sendSMSBasedOnRealSchedule(req: Request, res: Response) {
//   const { phoneNumber, childId } = req.body;

//   // Calculate the reminder date (2 days from today)
//   const reminderDate = new Date();
//   reminderDate.setDate(reminderDate.getDate() + 2);

//   // Define the start and end of the reminder date
//   const reminderDateStart = new Date(reminderDate);
//   reminderDateStart.setHours(0, 0, 0, 0);
//   const reminderDateEnd = new Date(reminderDate);
//   reminderDateEnd.setHours(23, 59, 59, 999);

//   try {
//     // Retrieve the child's information
//     const child = await ChildModel.findById(childId);
//     if (!child) {
//       return res.status(404).send({ message: "Child not found" });
//     }

//     const childName = `${child.firstName} ${child.lastName}`;

//     // Query the database for schedules matching the reminder date and not yet sent
//     const schedules = await SchedulingModel.find({
//       childId,
//       scheduleDate: {
//         $gte: reminderDateStart,
//         $lt: reminderDateEnd,
//       },
//       notificationSent: false, // Only fetch unsent schedules
//     });

//     // Prepare the SMS message
//     const vaccinations: string[] = [];
//     let weighingScheduled = false;
//     let location = "";

//     for (const schedule of schedules) {
//       const scheduleDate = schedule.scheduleDate.toISOString().split("T", 1)[0];
//       location = schedule.location || "designated location";

//       if (schedule.scheduleType === "vaccination") {
//         const vaccineInfo = schedule.vaccineName
//           ? `${schedule.vaccineName}`
//           : "vaccine";
//         const doseInfo = schedule.doseNumber
//           ? `dose ${schedule.doseNumber}`
//           : "";
//         vaccinations.push(`${vaccineInfo} ${doseInfo}`.trim());
//       } else if (schedule.scheduleType === "weighing") {
//         weighingScheduled = true;
//       }
//     }

//     // Construct the message based on the schedule type
//     let message = `Reminder: Your child ${childName} has a scheduled `;
//     if (weighingScheduled) {
//       message += `weighing at ${location} on ${
//         reminderDate.toISOString().split("T", 1)[0]
//       }. `;
//     }
//     if (vaccinations.length > 0) {
//       const vaccinesList = vaccinations.join(", ");
//       message += `vaccination(s) (${vaccinesList}) at ${location} on ${
//         reminderDate.toISOString().split("T", 1)[0]
//       }.`;
//     }

//     // Only send SMS if there's a relevant schedule
//     if (weighingScheduled || vaccinations.length > 0) {
//       console.log("Sending SMS with message:", message);
//       await sendScheduledSMS(phoneNumber, message); // Send the SMS

//       // Update the `notificationSent` field for the sent schedules
//       await SchedulingModel.updateMany(
//         {
//           childId,
//           scheduleDate: {
//             $gte: reminderDateStart,
//             $lt: reminderDateEnd,
//           },
//         },
//         {
//           $set: {
//             notificationSent: true,
//             notificationDate: new Date(),
//             notificationContent: message,
//           },
//         }
//       );
//       console.log("Updated schedules to mark SMS as sent.");
//     }

//     res.send({
//       message: "Checked and sent SMS based on real schedule if matched.",
//     });
//   } catch (error: any) {
//     console.error("Failed to retrieve or update schedules:", error.message);
//     res.status(500).send({ message: "Error fetching or updating schedules." });
//   }
// }

// router.post(
//   "/sendRealScheduleSMS",
//   expressAsyncHandler(async (req: Request, res: Response) => {
//     await sendSMSBasedOnRealSchedule(req, res);
//   })
// );

// cron job TODO:
// Function to send SMS FIXME: Working on schedule date
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

// // Core function to find schedules and send reminders FIXME: Working on schedule date
// export async function sendDailyReminders() {
//   const reminderDate = new Date();
//   reminderDate.setDate(reminderDate.getDate() + 2); // Set reminder for 2 days ahead

//   const reminderDateStart = new Date(reminderDate);
//   reminderDateStart.setHours(0, 0, 0, 0); // Start of the reminder day
//   const reminderDateEnd = new Date(reminderDate);
//   reminderDateEnd.setHours(23, 59, 59, 999); // End of the reminder day

//   try {
//     // Find schedules for two days from now that haven't had a notification sent
//     const schedules = await SchedulingModel.find({
//       scheduleDate: {
//         $gte: reminderDateStart,
//         $lt: reminderDateEnd,
//       },
//       notificationSent: false, // Only fetch unsent schedules
//     });

//     for (const schedule of schedules) {
//       const phoneNumber = schedule.motherPhoneNumber;
//       const child = await ChildModel.findById(schedule.childId);
//       if (!child) continue;

//       const childName = `${child.firstName} ${child.lastName}`;
//       const location = schedule.location || "designated location";
//       const scheduleDate = schedule.scheduleDate.toISOString().split("T", 1)[0];

//       // Construct the message
//       let message = `Reminder: Your child ${childName} has a scheduled `;
//       if (schedule.scheduleType === "weighing") {
//         message += `weighing at ${location} on ${scheduleDate}. `;
//       }
//       if (schedule.scheduleType === "vaccination") {
//         const vaccineInfo = schedule.vaccineName
//           ? `${schedule.vaccineName}`
//           : "vaccine";
//         const doseInfo = schedule.doseNumber
//           ? `dose ${schedule.doseNumber}`
//           : "";
//         message += `vaccination (${vaccineInfo} ${doseInfo}) at ${location} on ${scheduleDate}.`;
//       }

//       console.log("Sending SMS with message:", message);

//       // Send the SMS
//       await sendScheduledSMS(phoneNumber, message);

//       // Update the schedule to mark SMS as sent
//       await SchedulingModel.updateOne(
//         { _id: schedule._id },
//         {
//           $set: {
//             notificationSent: true,
//             notificationDate: new Date(),
//             notificationContent: message,
//           },
//         }
//       );
//       console.log(`Updated schedule ${schedule._id} to mark SMS as sent.`);
//     }

//     console.log("All scheduled reminders checked and SMS sent if applicable.");
//   } catch (error: any) {
//     console.error("Failed to retrieve or update schedules:", error.message);
//   }
// }

// sendDailyReminders function in smsRouter.ts or where it's defined
export async function sendDailyReminders() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of the day

  const reminderDate = new Date(today);
  reminderDate.setDate(reminderDate.getDate() + 2); // Set reminder for 2 days ahead

  const reminderDateStart = new Date(reminderDate);
  reminderDateStart.setHours(0, 0, 0, 0);
  const reminderDateEnd = new Date(reminderDate);
  reminderDateEnd.setHours(23, 59, 59, 999);

  try {
    // Step 1: Reset notificationSent for missed schedules with rescheduleDate
    const resetResult = await SchedulingModel.updateMany(
      {
        scheduleDate: { $lt: today }, // Past schedules
        status: false, // Schedule was missed
        notificationSent: true, // Previous notification was sent
        rescheduleDate: { $exists: true }, // RescheduleDate is set
      },
      { $set: { notificationSent: false } } // Reset for reschedule reminder
    );
    console.log("Reset notificationSent for missed schedules:", resetResult);

    // Step 2: Find and send reminders for 2 days before scheduleDate or rescheduleDate
    const schedulesToRemind = await SchedulingModel.find({
      $or: [
        { scheduleDate: { $gte: reminderDateStart, $lt: reminderDateEnd } },
        { rescheduleDate: { $gte: reminderDateStart, $lt: reminderDateEnd } },
      ],
      notificationSent: false, // Only unsent reminders
      status: false, // Event has not been completed
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

      // Fetch child information (for name, etc.)
      const child = await ChildModel.findById(childId);
      const childName = child
        ? `${child.firstName} ${child.lastName}`
        : "Your child";

      // Format the date for the reminder message
      const reminderDate = rescheduleDate || scheduleDate;
      const formattedDate = reminderDate.toISOString().split("T")[0];

      // Construct the message based on the schedule type
      let message = `Reminder: ${childName} has a scheduled ${scheduleType} on ${formattedDate}. Please visit ${location}.`;

      // Include vaccine details if it's a vaccination and they exist
      if (scheduleType === "vaccination") {
        if (vaccineName) {
          message += ` Vaccine: ${vaccineName}`;
        }
        if (doseNumber) {
          message += `, Dose: ${doseNumber}`;
        }
      }

      console.log("Sending SMS with message:", message);

      // Send the SMS
      await sendScheduledSMS(motherPhoneNumber, message);

      // Mark the reminder as sent
      schedule.notificationSent = true;
      schedule.notificationDate = new Date();
      await schedule.save();
    }

    console.log("Daily SMS reminder job completed.");
  } catch (error) {
    console.error("Error running daily SMS reminder job:", error);
  }
}

// Send notification upon scheduloing

export default router;
