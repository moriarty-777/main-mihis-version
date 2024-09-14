import { Router } from "express";
import { mother } from "../data";
import expressAsyncHandler from "express-async-handler";
import { Mother, MotherModel } from "../models/mother.model";
import { loggerMiddleware } from "../middlewares/logger.mid";
import { HTTP_NOT_FOUND } from "../constants/http_status";
import { authMiddleware } from "../middlewares/auth.mid";

const router = Router();

// seed
router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const motherCount = await MotherModel.countDocuments();
    if (motherCount > 0) {
      res.send("Seed is already Done!");
      return;
    }

    await MotherModel.create(mother);
    res.send("Seed is Done");
  })
);

// router.get(
//   "/",
//   expressAsyncHandler(async (req, res) => {
//     const mothers = await MotherModel.find().populate(
//       "children",
//       "firstName lastName"
//     ); // get all the value from the database without parameter
//     res.send(mothers);
//   })
// );
router.get(
  "/",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const { purok, childrenCount, isTransient } = req.query;

    // Build filter object dynamically based on query parameters
    const filter: any = {};

    if (purok) filter.purok = purok;
    if (isTransient) filter.isTransient = isTransient === "true";

    // Apply filtering by children count
    if (childrenCount) {
      if (childrenCount === "1") {
        filter["children"] = { $size: 1 };
      } else if (childrenCount === "2") {
        filter["children"] = { $size: 2 };
      }
    }

    const mothers = await MotherModel.find(filter).populate(
      "children",
      "firstName lastName"
    );

    res.send(mothers);
  })
);

router.get(
  "/:id",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const specificMother = await MotherModel.findById(req.params.id).populate(
      "children",
      "firstName lastName photoPath nutritionalStatus isFullyVaccinated dateOfBirth vaccinations"
    );
    if (!specificMother) {
      res.status(404).send({ message: "Mother not found" });
      return; // Add a return here to prevent further code execution
    }

    // Check if children array exists and get the count
    const childrenCount = specificMother.children
      ? specificMother.children.length
      : 0;

    // Send the response including children count
    res.send({ ...specificMother.toObject(), childrenCount });
    // res.send(specificMother);
  })
);

router.delete(
  "/:id",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const motherId = req.params.id;
    const deletedMother = await MotherModel.findByIdAndDelete(motherId);

    if (!deletedMother) {
      res.status(HTTP_NOT_FOUND).send({ message: "Mother not found" });
    } else {
      res.send({ message: "Mother deleted successfully" });
    }
  })
);

router.patch(
  "/:id",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const motherId = req.params.id;
    const updatedMother = await MotherModel.findByIdAndUpdate(
      motherId,
      req.body,
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedMother) {
      res.status(HTTP_NOT_FOUND).send({ message: "Mother not found" });
      return;
    }

    res.send(updatedMother);
  })
);

export default router;
