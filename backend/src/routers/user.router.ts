import { Router } from "express";
import { users } from "../data";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs";

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

router.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
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
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "60d",
    }
  );

  // console.log("Generated Token:", token); // Log the token

  return {
    _id: user._id,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    token: token, // Make sure token is included in the return object
  };
  // user.token = token;
  // return user;
};

export default router;
