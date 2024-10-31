import { Router, Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

// export async function sendYearlyScheduleSMS(
//   phoneNumber: string,
//   child: any,
//   schedules: any[]
// ) {
//   const currentYear = new Date().getFullYear();

//   // Filter schedules for the current year
//   const yearlySchedules = schedules.filter((schedule) => {
//     const scheduleYear = new Date(schedule.scheduleDate).getFullYear();
//     return scheduleYear === currentYear;
//   });

//   // Format the schedule details
//   const scheduleDetails = yearlySchedules
//     .map((schedule) => {
//       const date = schedule.scheduleDate
//         ? schedule.scheduleDate.toISOString().split("T", 1)[0]
//         : "N/A";
//       const type =
//         schedule.scheduleType === "weighing" ? "Weighing" : "Vaccination";
//       const vaccineName = schedule.vaccineName || "";
//       const doseInfo =
//         schedule.scheduleType === "vaccination" && schedule.doseNumber
//           ? `dose ${schedule.doseNumber}`
//           : ""; // Include dose only if type is Vaccination
//       const description = schedule.weighingDescription || "";

//       return `${date}: ${type} ${vaccineName} ${doseInfo} ${description}`.trim();
//     })
//     .join("\n");

//   // Construct the full message
//   const message = `This Year Schedule for your child ${child.firstName} ${child.lastName}:\n${scheduleDetails}`;

//   // Define chunk size (67 characters for Unicode or 153 for GSM-7)
//   const maxLength = 67;

//   // Function to chunk message
//   function chunkMessage(text: string, maxLength: number): string[] {
//     const chunks = [];
//     let index = 0;
//     while (index < text.length) {
//       chunks.push(text.slice(index, index + maxLength));
//       index += maxLength;
//     }
//     return chunks;
//   }

//   // Chunk the message
//   const messageChunks = chunkMessage(message, maxLength);

//   // Send each chunk
//   try {
//     for (let i = 0; i < messageChunks.length; i++) {
//       const chunk = `${messageChunks[i]}`; // Optional: add part indicator

//       // const response = await axios.post(
//       //   MOVIDER_BASE_URL,
//       //   new URLSearchParams({
//       //     api_key: MOVIDER_API_KEY,
//       //     api_secret: MOVIDER_API_SECRET,
//       //     from: "CTCMIHIS",
//       //     to: phoneNumber,
//       //     text: chunk,
//       //   }),
//       //   {
//       //     headers: {
//       //       "Content-Type": "application/x-www-form-urlencoded",
//       //       Accept: "application/json",
//       //     },
//       //   }
//       // );
//       console.log(`Chunk ${chunk}`);
//     }
//   } catch (error: any) {
//     console.error(
//       "Failed to send yearly schedule SMS:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

// Send notification upon scheduloing

export default router;
