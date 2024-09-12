import { Router } from "express";
import { mother } from "../data";
import expressAsyncHandler from "express-async-handler";
import { Mother, MotherModel } from "../models/mother.model";
import { HTTP_NOT_FOUND } from "../constants/http_status";

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

router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const mothers = await MotherModel.find().populate(
      "children",
      "firstName lastName"
    ); // get all the value from the database without parameter
    res.send(mothers);
  })
);

router.get(
  "/:id",
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
