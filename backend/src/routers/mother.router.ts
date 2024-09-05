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

export default router;
