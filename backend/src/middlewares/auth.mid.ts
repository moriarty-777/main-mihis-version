// import { verify } from "jsonwebtoken";
// import { HTTP_UNAUTHORIZED } from "../constants/http_status";

// export default (req: any, res: any, next: any) => {
//   const token = req.headers.access_token as string;
//   if (!token) return res.status(HTTP_UNAUTHORIZED).send();

//   try {
//     const decodedUser = verify(token, process.env.JWT_SECRET!); // check the token if it is valid
//     req.user = decodedUser;
//   } catch (error) {
//     res.status(HTTP_UNAUTHORIZED).send();
//   }

//   return next();
// };

import { verify, JwtPayload } from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../constants/http_status";

export const authMiddleware = (req: any, res: any, next: any) => {
  let token: string | undefined = req.headers.authorization?.split(" ")[1];
  if (!token) {
    token = req.headers.access_token as string;
  }

  if (!token) {
    return res
      .status(HTTP_UNAUTHORIZED)
      .send({ message: "Access token missing. Unauthorized access." });
  }

  try {
    // Decode the token using JWT and cast the result to `JwtPayload` to access its properties
    const decodedUser = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Ensure that the decoded token contains `id` (user ID) and role
    if (decodedUser && decodedUser.id) {
      req.user = decodedUser;

      // Check if user has a valid role (e.g., admin, midwife, bhw). Block the request if the role is not assigned.
      if (!decodedUser.role || decodedUser.role === "pending") {
        return res
          .status(HTTP_UNAUTHORIZED)
          .send({ message: "User role not assigned. Contact admin." });
      }

      next(); // Continue to the next middleware or route handler
    } else {
      return res
        .status(HTTP_UNAUTHORIZED)
        .send({ message: "Invalid token. Unauthorized access." });
    }
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(HTTP_UNAUTHORIZED)
        .send({ message: "Token expired. Please log in again." });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(HTTP_UNAUTHORIZED)
        .send({ message: "Invalid token. Unauthorized access." });
    } else {
      return res
        .status(HTTP_UNAUTHORIZED)
        .send({ message: "Token verification failed. Unauthorized access." });
    }
  }
};
