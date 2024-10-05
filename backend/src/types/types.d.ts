import { Request } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    // Add any other fields you attach to the `user` object in your middleware
  };
}

export { AuthenticatedRequest };
