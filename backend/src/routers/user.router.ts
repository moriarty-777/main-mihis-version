import { Router } from "express";
import { users } from "../data";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User, UserModel } from "../models/user.model";
// import { loggerMiddleware } from "../middlewares/logger.mid";
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND } from "../constants/http_status";
import bcrypt from "bcryptjs";
import { LogModel } from "../models/log.model";
import { getLogHistory } from "../controller/admin.controller";
import { authMiddleware } from "../middlewares/auth.mid";
import { loggerMiddleware } from "../middlewares/logger.mid";
import { AuthenticatedRequest } from "../types/types";

const router = Router();

// seed
router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const userCount = await UserModel.countDocuments();
    if (userCount > 0) {
      res.send("Seed is already Done!");
      return;
    }

    await UserModel.create(users);
    res.send("Seed is Done");
  })
);
router.get("/logs", getLogHistory);
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const users = await UserModel.find();

    res.send(users);
  })
);

router.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const specificUser = await UserModel.findById(req.params.id);
    if (!specificUser) {
      res.status(404).send({ message: "User not found" });
      return; // Add a return here to prevent further code execution
    }
    res.send(specificUser);
  })
);
// router.get(
//   "/midwives",
//   expressAsyncHandler(async (req, res) => {
//     const midwives = await UserModel.find(
//       { role: "midwife" },
//       "firstName lastName _id"
//     );
//     res.send(midwives);
//   })
// );
// login
router.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      //
      const log = new LogModel({
        userId: user.id,
        username: user.username,
        role: user.role,
        action: "login",
        timestamp: new Date(),
      });
      await log.save();
      //
      res.send(generateTokenResponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
    }
    // if (user) {
    //   res.send(generateTokenResponse(user));
    // } else {
    //   res.status(HTTP_BAD_REQUEST).send("Username or Password is not valid");
    // }
  })
);
// logout
router.post(
  "/logout",
  authMiddleware,
  expressAsyncHandler(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id; // Get the user ID from middleware
    if (!userId) {
      res.status(HTTP_BAD_REQUEST).send("User ID is missing");
      return;
    }

    const user = await UserModel.findById(userId);
    if (user) {
      const log = new LogModel({
        userId: user.id,
        username: user.username,
        role: user.role,
        action: "logout",
        timestamp: new Date(),
      });

      await log.save();
      res.send({ message: "Logout logged successfully" });
    } else {
      res.status(HTTP_BAD_REQUEST).send("User not found");
    }
  })
);

router.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const { firstName, lastName, username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (user) {
      // user with that username exist return
      res.status(HTTP_BAD_REQUEST).send("User is already exist, please login");
      return;
    }
    const encryptedPassword = await bcrypt.hash(password, 10); //encrypt the password

    const newUser: User = {
      id: "",
      firstName,
      lastName,
      username: username.toLowerCase(),
      password: encryptedPassword,
      role: "pending", // Default role, change as needed
    }; // create new user

    //save to the database
    const dbUser = await UserModel.create(newUser);
    // user to generate token response and directly making the user login after the registration

    res.send(generateTokenResponse(dbUser));
  })
);

const generateTokenResponse = (user: any) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      firstName: user.firstName, // Add firstName
      lastName: user.lastName,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "60d",
    }
  );

  // console.log("Generated Token:", token); // Log the token

  return {
    // _id: user._id,
    id: user.id,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    token: token, // Make sure token is included in the return object
  };
  // user.token = token;
  // return user;
};

// Update
router.patch(
  "/:id",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, {
      new: true, // Return the updated document
    });

    if (!updatedUser) {
      res.status(HTTP_NOT_FOUND).send({ message: "User not found" });
      return;
    }

    res.send(updatedUser);
  })
);

// Delete User
router.delete(
  "/:id",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(HTTP_NOT_FOUND).send({ message: "User not found" }); // No need to return, just send the response
    } else {
      res.send({ message: "User deleted successfully" }); // Also just send the response
    }
  })
);

// Optional
// router.get(
//   "/",
//   expressAsyncHandler(async (req, res) => {
//     const { role, experience } = req.query;

//     // Start building the filter object
//     const filter = {};

//     // Apply role filter
//     if (role) {
//       filter.role = role;
//     }

//     // Fetch users from database
//     let users = await UserModel.find(filter);

//     // Filter users by experience if requested
//     if (experience) {
//       users = users.filter(user => {
//         const totalMonths = calculateTotalMonths(user.dateOfService);
//         if (experience === 'lessThan1') return totalMonths < 12;
//         if (experience === 'lessThan5') return totalMonths < 60;
//         if (experience === 'moreThan10') return totalMonths > 120;
//         return true;
//       });
//     }

//     res.send(users);
//   })
// );

// // Helper function to calculate total months of service
// const calculateTotalMonths = (dateOfService) => {
//   const serviceDate = new Date(dateOfService);
//   const today = new Date();

export default router;
