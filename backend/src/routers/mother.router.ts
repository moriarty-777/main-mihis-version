import { Router } from "express";
import { mother, mother2022, mother111 } from "../data";
import expressAsyncHandler from "express-async-handler";
import { Mother, MotherModel } from "../models/mother.model";
import { loggerMiddleware } from "../middlewares/logger.mid";
import { HTTP_NOT_FOUND } from "../constants/http_status";
import { authMiddleware } from "../middlewares/auth.mid";
import { ChildModel } from "../models/child.model";
import { SchedulingModel } from "../models/scheduling.model";
import { WeighingHistoryModel } from "../models/weighing-history.model";
import { VaccinationModel } from "../models/vaccination.model";
import { MissedVaccineModel } from "../models/missedVaccine.model";
import { AnthropometricModel } from "../models/anthropometric.model";
import { NutritionalStatusModel } from "../models/nutritional-status.model";

const router = Router();
// Retrieve child FIXME: tobe deleted
router.get(
  "/export-mother-children",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const mothers = await MotherModel.find()
      .populate("children", "firstName lastName id dateOfBirth gender") // Populate the child details
      .select("firstName lastName phone children"); // Select the fields we need for export

    if (!mothers) {
      res.status(404).send({ message: "No mothers found" });
    }

    // Send the filtered data (mother and their children)
    res.send(mothers);
  })
);

// Remove +
// router.get(
//   "/propername", // The route to navigate to
//   expressAsyncHandler(async (req, res) => {
//     try {
//       // Update all mother phone numbers by removing the "+" sign
//       const result = await MotherModel.updateMany(
//         { phone: { $regex: /^\+/ } }, // Find mothers with + in phone
//         [
//           {
//             $set: {
//               phone: {
//                 $replaceAll: { input: "$phone", find: "+", replacement: "" },
//               },
//             },
//           },
//         ] // Remove + from phone
//       );

//       res.send(
//         `Successfully updated ${result.modifiedCount} mothers' phone numbers`
//       );
//     } catch (error) {
//       console.error("Error updating phone numbers:", error);
//       res.status(500).send({ message: "Failed to update phone numbers" });
//     }
//   })
// );
// seed
// router.get(
//   "/seed",
//   expressAsyncHandler(async (req, res) => {
//     const motherCount = await MotherModel.countDocuments();
//     if (motherCount > 0) {
//       res.send("Seed is already Done!");
//       return;
//     }

//     await MotherModel.create(mother);
//     res.send("Seed is Done");
//   })
// );
// Seed mother
// Seed new mother data without deleting existing records
// FIXME: router.get(
//   "/seed",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       await MotherModel.insertMany(mother); // insert new mother data without overwriting
//       res.send("New mother data seeded successfully!");
//     } catch (error) {
//       res.status(500).send({ message: "Error seeding data", error });
//     }
//   })
// );
// TODO: Seeding
// router.get(
//   "/seed",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       for (const mother of mother111) {
//         // Check if the mother already exists based on firstName and lastName or any unique field (e.g., phone, email)
//         const existingMother = await MotherModel.findOne({
//           firstName: mother.firstName,
//           lastName: mother.lastName,
//         });

//         // Insert the mother data only if it doesn't exist
//         if (!existingMother) {
//           await MotherModel.create(mother);
//         }
//       }

//       res.send("New mother data seeded successfully without overwriting!");
//     } catch (error) {
//       res.status(500).send({ message: "Error seeding data", error });
//     }
//   })
// );

// Link Mother to Child Seeding
// Route to link all children to their mother based on existing data
router.get(
  "/link-children-to-mother",
  expressAsyncHandler(async (req, res) => {
    try {
      // Fetch all mothers
      const mothers = await MotherModel.find().populate("children");

      // Iterate through each mother and link their children
      for (const mother of mothers) {
        // Iterate through the children array in each mother
        for (const childId of mother.children) {
          // Update the child record to link it to the mother
          await ChildModel.findByIdAndUpdate(childId, {
            motherId: mother._id, // Link the child to the mother
          });
        }
      }

      res.send("All children linked to their mothers successfully!");
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error linking children to mothers", error });
    }
  })
);

// Link Child to Mother
// Link child to mother via child ID
// router.post(
//   "/link-child",
//   expressAsyncHandler(async (req, res) => {
//     const { motherId, childId } = req.body;

//     // Check if the child exists
//     const childExists = await ChildModel.findById(childId);
//     if (!childExists) {
//       res.status(404).send({ message: "Child not found" });
//     }

//     // Update the mother document by pushing the child's ID into the children array
//     const updatedMother = await MotherModel.findByIdAndUpdate(
//       motherId,
//       { $addToSet: { children: childId } }, // Ensure the child isn't already linked
//       { new: true } // Return the updated document
//     );

//     if (!updatedMother) {
//       res.status(404).send({ message: "Mother not found" });
//     }

//     res.status(200).send({
//       message: "Child linked to mother successfully",
//       mother: updatedMother,
//     });
//   })
// );

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

// ADDing mother
router.post(
  "/add",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    console.log("Received Data:", req.body); // Log incoming data
    const {
      firstName,
      lastName,
      gender,
      phone,
      email,
      barangay,
      purok,
      photoPath,
      isTransient,
    } = req.body;

    // Create the new mother
    const newMother = new MotherModel({
      firstName,
      lastName,
      gender,
      phone,
      email,
      barangay,
      purok,
      photoPath: photoPath || "assets/img/default-user-profile.jpg", // default image if none provided
      isTransient: isTransient || false,
      children: [], // Initialize with empty children
    });

    const savedMother = await newMother.save();
    console.log("Saved Mother:", savedMother); // Check all fields
    if (!savedMother) {
      res.status(500).send({ message: "Error adding mother" });
    } else {
      res.status(201).send(savedMother); // Send the created mother
    }
  })
);

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
    // const specificMother = await MotherModel.findById(req.params.id).populate(
    //   "children",
    //   "firstName lastName photoPath nutritionalStatus isFullyVaccinated dateOfBirth vaccinations"
    // );
    const specificMother = await MotherModel.findById(req.params.id).populate({
      path: "children",
      populate: {
        path: "nutritionalStatus", // Populate the nutritional status of each child
        select: "status", // Select only the 'status' field or other relevant fields
      },
    });

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

// router.delete(
//   "/:id",
//   authMiddleware,
//   loggerMiddleware,
//   expressAsyncHandler(async (req, res) => {
//     const motherId = req.params.id;
//     const deletedMother = await MotherModel.findByIdAndDelete(motherId);

//     if (!deletedMother) {
//       res.status(HTTP_NOT_FOUND).send({ message: "Mother not found" });
//     } else {
//       res.send({ message: "Mother deleted successfully" });
//     }
//   })
// );
router.delete(
  "/:id",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const motherId = req.params.id;

    // Find the mother and check if she exists
    const deletedMother = await MotherModel.findByIdAndDelete(motherId);

    if (!deletedMother) {
      res.status(HTTP_NOT_FOUND).send({ message: "Mother not found" });
    }

    // Find all children associated with the mother
    const children = await ChildModel.find({ motherId: motherId });

    // Loop through each child and delete their data
    for (const child of children) {
      const childId = child._id;

      // Delete related schedules
      await SchedulingModel.deleteMany({ childId: childId });

      // Delete related weighing history
      await WeighingHistoryModel.deleteMany({ childId: childId });

      // Delete related vaccinations
      await VaccinationModel.deleteMany({ childId: childId });

      // Delete missed vaccines (if applicable)
      await MissedVaccineModel.deleteMany({ childId: childId });

      // Delete related anthropometric and nutritional status records
      await AnthropometricModel.deleteMany({ childId: childId });
      await NutritionalStatusModel.deleteMany({ childId: childId });

      // Finally, delete the child
      await ChildModel.findByIdAndDelete(childId);
    }

    // Respond with success message
    res.send({
      message: "Mother and all related children and data deleted successfully",
    });
  })
);

// updating mother
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

router.get(
  "/:motherId/children",
  expressAsyncHandler(async (req, res) => {
    const motherId = req.params.motherId;

    // Assuming you have a field in the Child schema linking to the mother
    const children = await ChildModel.find({ motherId });

    if (!children) {
      res
        .status(HTTP_NOT_FOUND)
        .send({ message: "No children found for this mother" });
      return;
    }

    res.send(children); // Send back the list of children
  })
);

export default router;
