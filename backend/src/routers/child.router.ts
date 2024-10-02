import { Router } from "express";
import { child } from "../data";
import expressAsyncHandler from "express-async-handler";
import { loggerMiddleware } from "../middlewares/logger.mid";
import { ChildModel } from "../models/child.model";
import { MotherModel } from "../models/mother.model";
import { HTTP_NOT_FOUND } from "../constants/http_status";
import { authMiddleware } from "../middlewares/auth.mid";
const router = Router();

// seed to db
// router.get(
//   "/child/seed",
//   expressAsyncHandler(async (req, res) => {
//     const childCount = await ChildModel.countDocuments();
//     if (childCount > 0) {
//       res.send("Seed is already Done!");
//       return;
//     }

//     await ChildModel.create(child);
//     res.send("Seed is Done");
//   })
// );

// get child TODO:
// router.get(
//   "/child",
//   expressAsyncHandler(async (req, res) => {
//     const children = await ChildModel.find(); // get all the value from the database without parameter
//     res.send(children);
//   })
// );
// TODO:

// router.get(
//   "/child",
//   expressAsyncHandler(async (req, res) => {
//     const { gender, purok, nutritionalStatus, vaxStatus } = req.query;

//     // Create filter object based on available query parameters
//     const filter: any = {};

//     if (gender) filter.gender = gender;
//     if (purok) filter.purok = purok;
//     if (nutritionalStatus) filter.nutritionalStatus = nutritionalStatus;
//     if (vaxStatus) filter.vaxStatus = vaxStatus;

//     const children = await ChildModel.find(filter); // Apply filtering
//     res.send(children);
//   })
// );
// FIXME:
// child.router.ts
router.get(
  "/child",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const {
      gender,
      purok,
      nutritionalStatus,
      vaxStatus,
      heightForAge,
      weightForAge,
      weightForLength,
    } = req.query; // Capture filters from query parameters

    // Build filter object dynamically based on query parameters
    const filter: any = {};

    if (gender) filter.gender = gender; // Filter by gender if provided
    if (purok) filter.purok = purok; // Filter by purok if provided
    if (nutritionalStatus) filter.nutritionalStatus = nutritionalStatus; // Filter by nutritional status
    if (heightForAge)
      filter["weighingHistory.heightForAgeStatus"] = heightForAge; // Filter by height for age if provided
    if (weightForAge)
      filter["weighingHistory.weightForAgeStatus"] = weightForAge; // Filter by weight for age if provided
    if (weightForLength)
      filter["weighingHistory.weightForLengthHeightStatus"] = weightForLength; // Filter by weight for length if provided
    // Apply vaccination status filter only if vaxStatus is not empty
    if (vaxStatus) {
      if (vaxStatus === "Fully Vaccinated") {
        filter.isFullyVaccinated = true;
      } else if (vaxStatus === "Partially Vaccinated") {
        filter.isFullyVaccinated = false;
        filter["vaccinations.0"] = { $exists: true }; // At least one vaccination
      } else if (vaxStatus === "Not Vaccinated") {
        filter.vaccinations = { $size: 0 }; // No vaccinations
      }
    }

    // Fetch filtered children from the database
    const children = await ChildModel.find(filter);
    res.send(children); // Send the filtered results
  })
);

// FIXME:
router.get(
  "/children-page/:id",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    // console.log("Fetching child by ID:", req.params.id); // Add log here
    const specificChild = await ChildModel.findById(req.params.id).populate(
      "vaccinations.midwifeId",
      "firstName lastName"
    );
    // Now fetch the mother associated with this child
    const mother = await MotherModel.findOne({
      children: req.params.id,
    }).select("firstName lastName");

    // Combine the child and mother data into the response
    res.send({ child: specificChild, mother });
  })
);

// Get Vaccination Data Fully Partially Not Vaccinated
router.get(
  "/child/vaccination-summary",

  expressAsyncHandler(async (req, res) => {
    const fullyVaccinatedCount = await ChildModel.countDocuments({
      isFullyVaccinated: true,
    });

    const partiallyVaccinatedCount = await ChildModel.countDocuments({
      isFullyVaccinated: false,
      vaccinations: { $exists: true, $not: { $size: 0 } }, // Has some vaccinations
    });

    const notVaccinatedCount = await ChildModel.countDocuments({
      vaccinations: { $size: 0 }, // No vaccinations
    });

    console.log(
      fullyVaccinatedCount,
      "pv",
      partiallyVaccinatedCount,
      "nv",
      notVaccinatedCount
    );

    res.json({
      fullyVaccinatedCount,
      partiallyVaccinatedCount,
      notVaccinatedCount,
    });
  })
);

// Delete
router.delete(
  "/child/:id",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const childId = req.params.id;
    const deletedChild = await ChildModel.findByIdAndDelete(childId);

    if (!deletedChild) {
      res.status(HTTP_NOT_FOUND).send({ message: "Child not found" });
    } else {
      res.send({ message: "Child deleted successfully" });
    }
  })
);
// Update

router.patch(
  "/child/:id",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const childId = req.params.id;
    const updatedChild = await ChildModel.findByIdAndUpdate(childId, req.body, {
      new: true, // Return the updated document
    });

    if (!updatedChild) {
      res.status(HTTP_NOT_FOUND).send({ message: "Child not found" });
      return;
    }

    res.send(updatedChild);
  })
);

export default router;

// Run Once
// router.put(
//   "/update-midwife-id",
//   expressAsyncHandler(async (req, res) => {
//     const oldMidwifeId = "66cc86cfcec65103d4abdfe3"; // Old midwifeId
//     const newMidwifeId = "66dfe2205309a42e3710c6af"; // New midwifeId

//     // Update all children where vaccinations.midwifeId equals oldMidwifeId
//     const result = await ChildModel.updateMany(
//       { "vaccinations.midwifeId": oldMidwifeId }, // Filter to match old midwifeId
//       { $set: { "vaccinations.$[elem].midwifeId": newMidwifeId } }, // Update to new midwifeId
//       { arrayFilters: [{ "elem.midwifeId": oldMidwifeId }] } // Apply to specific vaccination element
//     );

//     // Return the result of the update
//     res.send({
//       message: `Successfully updated ${result.modifiedCount} child records`,
//     });
//   })
// );

// update bhw
// router.put(
//   "/update-bhw-id",
//   expressAsyncHandler(async (req, res) => {
//     // Mapping of old and new bhwIds
//     const updates = [
//       {
//         oldBhwId: "66cc86cfcec65103d4abdfe4",
//         newBhwId: "66ec1a5cc96da2bdd388b410",
//       },
//       {
//         oldBhwId: "66cc86cfcec65103d4abdfe6",
//         newBhwId: "66ec1ff1ce1b7ec7340eec63",
//       },
//       {
//         oldBhwId: "66cc86cfcec65103d4abdfe7",
//         newBhwId: "66ec242da635b2a3664ca66b",
//       },
//     ];

//     // Loop through each update pair and apply the update
//     for (const update of updates) {
//       const result = await ChildModel.updateMany(
//         { "vaccinations.bhwId": update.oldBhwId }, // Filter to match old bhwId
//         { $set: { "vaccinations.$[elem].bhwId": update.newBhwId } }, // Update to new bhwId
//         { arrayFilters: [{ "elem.bhwId": update.oldBhwId }] } // Apply to specific vaccination element
//       );

//       console.log(
//         `Successfully updated ${result.modifiedCount} records for bhwId ${update.oldBhwId}`
//       );
//     }

//     // Return the result of the update
//     res.send({
//       message: "Successfully updated child records with new bhwIds",
//     });
//   })
// );
