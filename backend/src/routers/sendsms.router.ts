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

export default router;
