import { LogModel } from "../models/log.model";

export const loggerMiddleware = async (req: any, res: any, next: any) => {
  try {
    const user = req.user; // Ensure req.user is populated by authMiddleware

    if (user && user.id) {
      const action = req.method + " " + req.originalUrl; // Example: 'POST /api/child'
      // FIXME:
      // Define action messages based on HTTP methods
      let actionMessage = `${user.firstName} ${user.lastName} `;

      switch (req.method) {
        case "POST":
          actionMessage += `added a new record`;
          break;
        case "PATCH":
          actionMessage += `updated a record`;
          break;
        case "DELETE":
          actionMessage += `deleted a record`;
          break;
        default:
          actionMessage += `view page`;
      }

      if (req.originalUrl.includes("/child")) {
        actionMessage += " for child";
      } else if (req.originalUrl.includes("/mother")) {
        actionMessage += " for mother";
      } else if (req.originalUrl.includes("/user")) {
        actionMessage += " for user";
      }

      // Log to the database (optional, based on whether you want to log it)
      // TODO: Disable Logging to save database space
      // const log = new LogModel({
      //   userId: user.id,
      //   username: user.username,
      //   role: user.role,
      //   action: actionMessage,
      //   timestamp: new Date(),
      //   ipAddress: req.ip,
      // });

      // await log.save();
      // TODO: Disable Logging to save database space
      actionMessage += ` at URL: ${req.originalUrl}`;
      console.log("Log saved successfully:", actionMessage);
    } else {
      console.log("No user information available, skipping logging.");
    }

    next(); // Pass control to the next middleware
  } catch (error) {
    console.error("Error in loggerMiddleware:", error);
    next(); // Continue even if logging fails
  }
};
