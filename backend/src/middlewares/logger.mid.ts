// import { Request, Response, NextFunction } from "express";
// import { LogModel } from "../models/log.model";

// export const loggerMiddleware = async (req: any, res: any, next: any) => {
//   const user = req.user; // Assuming user is authenticated and available on request
//   const action = req.method + " " + req.originalUrl; // Example: 'POST /api/child'

//   if (
//     user &&
//     user.role
//     //   (user.role === "bhw" || user.role === "midwife" || user.role === "admin")
//   ) {
//     //   Create a new log entry
//     const log = new LogModel({
//       userId: user._id,
//       username: user.username,
//       role: user.role,
//       action: action,
//       timestamp: new Date(),
//       ipAddress: req.ip, // Optional: You can store the user's IP address
//     });

//     await log.save();
//     //   }

//     next(); // Pass control to the next middleware
//   }
// };

/*
import { Request, Response, NextFunction } from 'express';
import { LogModel } from './models/log.model'; // Assuming your log model is in models folder

export const loggerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user; // Assuming user is authenticated and available on request
  const action = req.method + ' ' + req.originalUrl; // Example: 'POST /api/child'
  
  if (user && user.role && (user.role === 'bhw' || user.role === 'midwife')) {
    // Create a new log entry
    const log = new LogModel({
      userId: user._id,
      username: user.username,
      role: user.role,
      action: action,
      timestamp: new Date(),
      ipAddress: req.ip, // Optional: You can store the user's IP address
    });

    await log.save();
  }
  
  next(); // Pass control to the next middleware
};

*/

// import { verify } from "jsonwebtoken";
// import { HTTP_UNAUTHORIZED } from "../constants/http_status";

// export default (req: any, res: any, next: any) => {
//   // Extract the token from the Authorization header (Bearer token)
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res
//       .status(HTTP_UNAUTHORIZED)
//       .send({ message: "No token provided." });
//   }

//   const token = authHeader.split(" ")[1]; // Expecting "Bearer <token>"
//   if (!token) {
//     return res
//       .status(HTTP_UNAUTHORIZED)
//       .send({ message: "Invalid token format." });
//   }

//   try {
//     // Verify the token
//     const decodedUser = verify(token, process.env.JWT_SECRET!);
//     req.user = decodedUser; // Attach decoded user to the request
//   } catch (error) {
//     return res
//       .status(HTTP_UNAUTHORIZED)
//       .send({ message: "Invalid or expired token." });
//   }

//   return next(); // Proceed to the next middleware or route handler
// };
import { LogModel } from "../models/log.model";

export const loggerMiddleware = async (req: any, res: any, next: any) => {
  try {
    const user = req.user; // Ensure req.user is populated by authMiddleware

    if (user && user.id) {
      const action = req.method + " " + req.originalUrl; // Example: 'POST /api/child'

      const log = new LogModel({
        userId: user.id, // Use the `id` from the authenticated user
        username: user.username,
        role: user.role,
        action: action,
        timestamp: new Date(),
        ipAddress: req.ip,
      });

      await log.save();
      console.log("Log saved successfully:", log);
    } else {
      console.log("No user information available, skipping logging.");
    }

    next(); // Pass control to the next middleware
  } catch (error) {
    console.error("Error in loggerMiddleware:", error);
    next(); // Continue even if logging fails
  }
};
