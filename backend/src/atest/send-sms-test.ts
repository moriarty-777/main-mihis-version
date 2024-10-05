import { Twilio } from "twilio";
import dotenv from "dotenv";

dotenv.config();

// Extract Twilio credentials from .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER as string;
const toPhoneNumber = process.env.TO_NUMBER as string;
// Initialize Twilio client
const client = new Twilio(accountSid, authToken);

// Function to send SMS
const sendSMS = async (body: string) => {
  const msgOptions = {
    from: twilioPhoneNumber,
    to: toPhoneNumber, // Recipient's phone number
    body: body, // Message content
  };

  try {
    const message = await client.messages.create(msgOptions);
    console.log("Message Sent! SID:", message.sid);
  } catch (error) {
    console.error("Failed to send SMS:", error);
  }
};

// Test the SMS function
sendSMS("Hello from Node.js App!");
