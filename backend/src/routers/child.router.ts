import { Router } from "express";
import { child, child22, child111 } from "../data";
import expressAsyncHandler from "express-async-handler";
import { loggerMiddleware } from "../middlewares/logger.mid";
import { AnthropometricModel } from "../models/anthropometric.model";
import { ChildModel } from "../models/child.model";
import { MotherModel } from "../models/mother.model";
import { HTTP_NOT_FOUND } from "../constants/http_status";
import { authMiddleware } from "../middlewares/auth.mid";
import {
  weighingHistoryData,
  anthropometricData,
  weight5,
  anthro5,
  nutritionalStatus5,
} from "../data2";
import { WeighingHistoryModel } from "../models/weighing-history.model";
import { NutritionalStatusModel } from "../models/nutritional-status.model";
import { Types } from "mongoose";

const router = Router();

// seed first
// router.get(
//   "/child/seed",
//   expressAsyncHandler(async (req, res) => {
//     const childCount = await ChildModel.countDocuments();
//     if (childCount > 0) {
//       res.send("Seed is already Done!");
//       return;
//     }

//     await ChildModel.create(child); // Seed the child data
//     res.send("Seed is Done");
//   })
// );
// This seed :TODO:
// router.get(
//   "/child/seed",
//   expressAsyncHandler(async (req, res) => {
//     const existingChildren = await ChildModel.countDocuments();

//     if (existingChildren > 0) {
//       res.send("Some data already exists! Adding more data...");
//     }

//     // Use the child22 array to seed more data
//     for (const child of child111) {
//       const existingChild = await ChildModel.findOne({
//         firstName: child.firstName,
//         lastName: child.lastName,
//       });
//       if (!existingChild) {
//         await ChildModel.create(child);
//       }
//     }

//     res.send("Seeding additional data from child111 is complete.");
//   })
// );

// Seed antro and weighing history
// Seed weighing history and anthropometric data
// router.get(
//   "/child/seed/weighing-anthro",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       // Step 1: Seed Weighing History anthro5 weight5 Data
//       for (const history of weight5) {
//         const newWeighingHistory = await WeighingHistoryModel.create(history);
//         console.log(
//           `Weighing history created for child: ${newWeighingHistory.child}`
//         );

//         // Step 2: Update the child to include the weighing history reference
//         await ChildModel.findByIdAndUpdate(newWeighingHistory.child, {
//           $push: { weighingHistory: newWeighingHistory._id },
//         });
//       }

//       // Step 3: Seed Anthropometric Data
//       for (const anthro of anthro5) {
//         const newAnthropometric = await AnthropometricModel.create(anthro);
//         console.log(
//           `Anthropometric data created for child: ${newAnthropometric.childId}`
//         );

//         // Step 4: Update the child to include the anthropometric reference
//         await ChildModel.findByIdAndUpdate(newAnthropometric.childId, {
//           anthropometricStatus: newAnthropometric._id,
//         });
//       }

//       res.send(
//         "Weighing history and anthropometric data seeding completed successfully."
//       );
//     } catch (error) {
//       console.error("Error during seeding process:", error);
//       res.status(500).send("Seeding failed");
//     }
//   })
// );
//  Seed Nutritional Status
// Seed nutritional status
// router.get(
//   "/child/seed/nutritional-status",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       // Step 1: Loop through the nutritionalStatus5 data and create a record for each entry
//       for (const entry of nutritionalStatus5) {
//         // Find the child by ID
//         const child = await ChildModel.findById(entry.childId);

//         // Check if the child exists
//         if (child) {
//           // Step 2: Check if the child already has a nutritionalStatus
//           if (child.nutritionalStatus) {
//             console.log(
//               `Nutritional status already exists for child: ${child.firstName}`
//             );
//             continue; // Skip creating a new record if one already exists
//           }

//           // Step 3: Create a new nutritional status record
//           const nutritionalStatus = new NutritionalStatusModel({
//             childId: child._id, // Store the child ID reference
//             status: entry.status, // Store the nutritional status (e.g., "Normal", "Malnourished")
//             dateOfStatus: entry.dateOfStatus, // Store the date of status
//           });

//           // Save the new nutritional status record
//           const savedNutritionalStatus = await nutritionalStatus.save();

//           // Step 4: Update the child document with the nutritionalStatus reference
//           child.nutritionalStatus = savedNutritionalStatus.id;
//           await child.save(); // Save the updated child document

//           // Log success
//           console.log(
//             `Nutritional status created and updated for child: ${child.firstName}`
//           );
//         } else {
//           console.log(`Child not found with ID: ${entry.childId}`);
//         }
//       }

//       // Send success response
//       res.send(
//         "Nutritional status seeding completed successfully and child records updated."
//       );
//     } catch (error) {
//       console.error("Error seeding nutritional status:", error);
//       res.status(500).send("Seeding failed");
//     }
//   })
// );

// router.delete(
//   "/nutritional-status/delete-all",
//   expressAsyncHandler(async (req, res) => {
//     // Delete all nutritional status data
//     const result = await NutritionalStatusModel.deleteMany({});
//     res.send({ message: "All nutritional status records deleted", result });
//   })
// );

// router.delete(
//   "/child/delete-all",
//   expressAsyncHandler(async (req, res) => {
//     // Delete all child data with the old structure
//     const result = await ChildModel.deleteMany({});
//     res.send({ message: "All old child data deleted", result });
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
    const children = await ChildModel.find(filter).populate(
      "nutritionalStatus"
    );
    res.send(children); // Send the filtered results
  })
);

// FIXME: get childprofile
router.get(
  "/children-page/:id",
  // authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const specificChild = await ChildModel.findById(req.params.id)
      .populate("anthropometricStatus")
      .populate({
        path: "weighingHistory",
        options: { sort: { dateOfWeighing: -1 } }, // Sort by date in descending order
      })
      .populate("nutritionalStatus");
    // .populate("weighingHistory");

    // Now fetch the mother associated with this child
    const mother = await MotherModel.findOne({
      children: req.params.id,
    }).select("firstName lastName");

    // Combine the child and mother data into the response
    res.send({ child: specificChild, mother });
  })
);

// TODO: Backup
// router.get(
//   "/children-page/:id",
//   authMiddleware,
//   loggerMiddleware,
//   expressAsyncHandler(async (req, res) => {
//     const specificChild = await ChildModel.findById(req.params.id).populate(
//       "firstName lastName"
//     );

//     // Now fetch the mother associated with this child
//     const mother = await MotherModel.findOne({
//       children: req.params.id,
//     }).select("firstName lastName");

//     // Combine the child and mother data into the response
//     res.send({ child: specificChild, mother });
//   })
// );

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

// Add child
router.post(
  "/child/add",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const { motherId, ...childData } = req.body;

    // Add the child to the database
    const newChild = await ChildModel.create(childData);

    // Link the child to the mother
    await MotherModel.findByIdAndUpdate(motherId, {
      $push: { children: newChild._id },
    });

    res.status(201).send(newChild);
  })
);

// Retrieve Child + Anthropometric
router.get(
  "/children-aanthro",
  expressAsyncHandler(async (req, res) => {
    const children = await ChildModel.find().populate("anthropometricStatus");

    res.send(children);
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
