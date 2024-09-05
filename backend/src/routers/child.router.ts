import { Router } from "express";
import { child } from "../data";
import expressAsyncHandler from "express-async-handler";
import { ChildModel } from "../models/child.model";
const router = Router();

// seed to db
router.get(
  "/child/seed",
  expressAsyncHandler(async (req, res) => {
    const childCount = await ChildModel.countDocuments();
    if (childCount > 0) {
      res.send("Seed is already Done!");
      return;
    }

    await ChildModel.create(child);
    res.send("Seed is Done");
  })
);

// get child
router.get(
  "/child",
  expressAsyncHandler(async (req, res) => {
    const children = await ChildModel.find(); // get all the value from the database without parameter
    res.send(children);
  })
);

router.get(
  "/children-page/:id",
  expressAsyncHandler(async (req, res) => {
    const specificChild = await ChildModel.findById(req.params.id).populate(
      "vaccinations.midwifeId",
      "firstName lastName"
    );

    res.send(specificChild);
  })
);

export default router;
