import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { Twilio } from "twilio";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Extract Twilio credentials from .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER as string;
const toPhoneNumber = process.env.TO_NUMBER as string;
// Initialize Twilio client
const client = new Twilio(accountSid, authToken);


router.post(
  "/send",
  expressAsyncHandler(async (req, res) => {
    // Hardcoded message details for testing
    const message = "Hello, this is from MIHIS!";

    try {
      const response = await client.messages.create({
        body: message, // Static message body
        from: twilioPhoneNumber, // Twilio phone number
        to: toPhoneNumber, // Recipient's phone number (from .env)
      });
      res.status(200).send({ message: "SMS Sent", sid: response.sid });
    } catch (error) {
      res.status(500).send({ error: "Failed to send SMS", details: error });
    }
  })
);
export default router;

// POST endpoint to send SMS
// router.post(
//   "/send",
//   expressAsyncHandler(async (req, res) => {
//     const { to, message } = req.body;

//     if (!to || !message) {
//       res
//         .status(400)
//         .send({ error: "Recipient and message body are required." });
//       return;
//     }

//     try {
//       const response = await client.messages.create({
//         body: message,
//         from: twilioPhoneNumber,
//         to: toPhoneNumber,
//       });
//       res.status(200).send({ message: "SMS Sent", sid: response.sid });
//     } catch (error) {
//       res.status(500).send({ error: "Failed to send SMS", details: error });
//     }
//   })
// );