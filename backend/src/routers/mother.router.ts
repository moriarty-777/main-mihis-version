import { Router } from "express";
import { mother } from "../data";
import expressAsyncHandler from "express-async-handler";
import { Mother, MotherModel } from "../models/mother.model";

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
      "firstName lastName"
    );

    res.send(specificMother);
  })
);

export default router;
