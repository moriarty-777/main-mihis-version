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
    const decodedUser = verify(token, process.env.JWT_SECRET!);

    // Cast decodedUser to JwtPayload to access the `id` property
    const userPayload = decodedUser as JwtPayload;

    // Ensure that the decoded token contains `id`, which is userId in your schema
    if (userPayload && userPayload.id) {
      req.user = userPayload; // Assign the decoded user object to `req.user`
      next();
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
