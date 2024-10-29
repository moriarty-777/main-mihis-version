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
import { SchedulingModel } from "../models/scheduling.model";
import { VaccinationModel } from "../models/vaccination.model";
import { UserModel } from "../models/user.model";
import { MissedVaccineModel } from "../models/missedVaccine.model";

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

// Seeding 'schedule TODO: remove all schedules

// router.delete(
//   "/clear-schedules",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       // Delete all schedules in the SchedulingModel
//       await SchedulingModel.deleteMany({});
//       res.send({ message: "All schedules cleared successfully." });
//     } catch (error) {
//       res.status(500).send({ message: "Error clearing schedules", error });
//     }
//   })
// );

// Seed Schedule :TODO:
// function addDays(date: Date, days: number): Date {
//   const result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// }

// TODO: populate schedules

// router.get(
//   "/populate-schedules",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       // Fetch all children
//       const children = await ChildModel.find();

//       if (!children || children.length === 0) {
//         res.status(404).send({ message: "No children found." });
//         return;
//       }

//       for (const child of children) {
//         const childId = child._id;
//         const mother = await MotherModel.findOne({
//           children: childId,
//         }).select("phone");

//         if (!mother) {
//           console.log(`Mother not found for child with ID: ${childId}`);
//           continue;
//         }

//         const schedules: any[] = [];
//         const motherPhoneNumber = mother.phone;
//         const dateOfBirth = new Date(child.dateOfBirth);

//         // 1. Generate Weighing Schedules (Annually until 5 years old)
//         const currentYear = new Date().getFullYear();
//         const currentAgeInMonths =
//           (new Date().getFullYear() - dateOfBirth.getFullYear()) * 12 +
//           (new Date().getMonth() - dateOfBirth.getMonth());

//         for (let year = 0; year < 5; year++) {
//           const weighingDate = new Date(currentYear + year, 0, 14); // Weighing is on January 14th
//           if (currentAgeInMonths < 60) {
//             const newSchedule = await SchedulingModel.create({
//               childId,
//               scheduleType: "weighing",
//               scheduleDate: weighingDate,
//               rescheduleDate: addDays(weighingDate, 7),
//               location: "Barangay Health Center",
//               notificationSent: false,
//               notificationDate: addDays(weighingDate, -2), // Notification 2 days before
//               motherPhoneNumber,
//               weighingDescription: `Weighing - Age ${year} year(s)`,
//               remarks: `Weighing scheduled for year ${year}.`,
//             });

//             // Add the schedule to the child document
//             await ChildModel.findByIdAndUpdate(childId, {
//               $push: { schedules: newSchedule._id },
//             });
//           }
//         }

//         // 2. Generate Vaccination Schedules
//         const vaccineSchedules = [
//           { vaccineName: "BCG", schedule: dateOfBirth }, // BCG at birth
//           { vaccineName: "Hepatitis B", schedule: dateOfBirth }, // Hepatitis B at birth
//           {
//             vaccineName: "Pentavalent",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 45),
//           }, // 1.5 months
//           {
//             vaccineName: "Pentavalent",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 75),
//           }, // 2.5 months
//           {
//             vaccineName: "Pentavalent",
//             doseNumber: 3,
//             schedule: addDays(dateOfBirth, 105),
//           }, // 3.5 months
//           {
//             vaccineName: "OPV",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 45),
//           }, // 1.5 months
//           {
//             vaccineName: "OPV",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 75),
//           }, // 2.5 months
//           {
//             vaccineName: "OPV",
//             doseNumber: 3,
//             schedule: addDays(dateOfBirth, 105),
//           }, // 3.5 months
//           {
//             vaccineName: "IPV",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 105),
//           }, // IPV at 3.5 months
//           {
//             vaccineName: "IPV",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 270),
//           }, // IPV at 9 months
//           {
//             vaccineName: "PCV",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 45),
//           }, // PCV at 1.5 months
//           {
//             vaccineName: "PCV",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 75),
//           }, // PCV at 2.5 months
//           {
//             vaccineName: "PCV",
//             doseNumber: 3,
//             schedule: addDays(dateOfBirth, 105),
//           }, // PCV at 3.5 months
//           {
//             vaccineName: "MMR",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 270),
//           }, // MMR at 9 months
//           {
//             vaccineName: "MMR",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 365),
//           }, // MMR at 12 months
//           {
//             vaccineName: "MCV",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 6 * 365),
//           }, // MCV for Grade 1
//           {
//             vaccineName: "MCV",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 12 * 365),
//           }, // MCV for Grade 7
//           {
//             vaccineName: "TD",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 6 * 365),
//           }, // TD for Grade 1
//           {
//             vaccineName: "TD",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 12 * 365),
//           }, // TD for Grade 7
//         ];

//         for (const vaccine of vaccineSchedules) {
//           const newSchedule = await SchedulingModel.create({
//             childId,
//             scheduleType: "vaccination",
//             scheduleDate: vaccine.schedule,
//             rescheduleDate: addDays(vaccine.schedule, 7),
//             location: "Barangay Health Center",
//             notificationSent: false,
//             notificationDate: addDays(vaccine.schedule, -2), // Notification 2 days before
//             motherPhoneNumber,
//             vaccineName: vaccine.vaccineName,
//             doseNumber: vaccine.doseNumber || 1,
//             remarks: `${vaccine.vaccineName} dose ${
//               vaccine.doseNumber || 1
//             } scheduled.`,
//           });

//           // Add the schedule to the child document
//           await ChildModel.findByIdAndUpdate(childId, {
//             $push: { schedules: newSchedule._id },
//           });
//         }

//         // 3. Additional Vaccines for Female Children
//         if (child.gender === "Female") {
//           const hpvVaccineSchedules = [
//             {
//               vaccineName: "Human Papillomavirus Vaccine (HPV)",
//               doseNumber: 1,
//               schedule: addDays(dateOfBirth, 9 * 365),
//             }, // HPV 1st Dose - Grade 4
//             {
//               vaccineName: "Human Papillomavirus Vaccine (HPV)",
//               doseNumber: 2,
//               schedule: addDays(dateOfBirth, 10 * 365),
//             }, // HPV 2nd Dose - 1 year later
//           ];

//           for (const hpv of hpvVaccineSchedules) {
//             const newSchedule = await SchedulingModel.create({
//               childId,
//               scheduleType: "vaccination",
//               scheduleDate: hpv.schedule,
//               rescheduleDate: addDays(hpv.schedule, 7),
//               location: "Barangay Health Center",
//               notificationSent: false,
//               notificationDate: addDays(hpv.schedule, -2), // Notification 2 days before
//               motherPhoneNumber,
//               vaccineName: hpv.vaccineName,
//               doseNumber: hpv.doseNumber,
//               remarks: `${hpv.vaccineName} dose ${hpv.doseNumber} scheduled (applicable to female only).`,
//             });

//             // Add the schedule to the child document
//             await ChildModel.findByIdAndUpdate(childId, {
//               $push: { schedules: newSchedule._id },
//             });
//           }
//         }
//       }

//       // Send response
//       res.send({ message: "Schedules created successfully for all children" });
//     } catch (error) {
//       res.status(500).send({ message: "Error generating schedule", error });
//     }
//   })
// );
// TODO:

// FIXME: Updated Schedules
// FIXME: Updated Schedules
// FIXME: Updated Schedules
// FIXME: Updated Schedules
// Helper function to add days
// function addDays(date: Date, days: number): Date {
//   const result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// }

// // Helper function to get the next Wednesday
// function getNextWednesday(date: Date): Date {
//   const dayOfWeek = date.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
//   const daysUntilWednesday = (3 - dayOfWeek + 7) % 7; // 3 is the index for Wednesday
//   return addDays(date, daysUntilWednesday);
// }

// // Populating schedules for all children
// router.get(
//   "/populate-schedules",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       // Fetch all children
//       const children = await ChildModel.find();

//       if (!children || children.length === 0) {
//         res.status(404).send({ message: "No children found." });
//         return;
//       }

//       for (const child of children) {
//         const childId = child._id;
//         const mother = await MotherModel.findOne({
//           children: childId,
//         }).select("phone");

//         if (!mother) {
//           console.log(`Mother not found for child with ID: ${childId}`);
//           continue;
//         }

//         const schedules: any[] = [];
//         const motherPhoneNumber = mother.phone;
//         const dateOfBirth = new Date(child.dateOfBirth);

//         // 1. Generate Weighing Schedules (Annually until 5 years old)
//         const currentYear = new Date().getFullYear();
//         const currentAgeInMonths =
//           (new Date().getFullYear() - dateOfBirth.getFullYear()) * 12 +
//           (new Date().getMonth() - dateOfBirth.getMonth());

//         for (let year = 0; year < 5; year++) {
//           const weighingDate = new Date(currentYear + year, 0, 14); // Weighing is on January 14th
//           if (currentAgeInMonths < 60) {
//             const newSchedule = await SchedulingModel.create({
//               childId,
//               scheduleType: "weighing",
//               scheduleDate: weighingDate,
//               rescheduleDate: addDays(weighingDate, 7),
//               location: "Barangay Health Center",
//               notificationSent: false,
//               notificationDate: addDays(weighingDate, -2), // Notification 2 days before
//               motherPhoneNumber,
//               weighingDescription: `Weighing - Age ${year} year(s)`,
//               remarks: `Weighing scheduled for year ${year}.`,
//             });

//             // Add the schedule to the child document
//             await ChildModel.findByIdAndUpdate(childId, {
//               $push: { schedules: newSchedule._id },
//             });
//           }
//         }

//         // 2. Generate Vaccination Schedules
//         const vaccineSchedules = [
//           { vaccineName: "BCG", schedule: dateOfBirth }, // BCG at birth
//           { vaccineName: "Hepatitis B", schedule: dateOfBirth }, // Hepatitis B at birth
//           {
//             vaccineName: "Pentavalent",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 45),
//           }, // 1.5 months
//           {
//             vaccineName: "Pentavalent",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 75),
//           }, // 2.5 months
//           {
//             vaccineName: "Pentavalent",
//             doseNumber: 3,
//             schedule: addDays(dateOfBirth, 105),
//           }, // 3.5 months
//           {
//             vaccineName: "OPV",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 45),
//           }, // 1.5 months
//           {
//             vaccineName: "OPV",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 75),
//           }, // 2.5 months
//           {
//             vaccineName: "OPV",
//             doseNumber: 3,
//             schedule: addDays(dateOfBirth, 105),
//           }, // 3.5 months
//           {
//             vaccineName: "IPV",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 105),
//           }, // IPV at 3.5 months
//           {
//             vaccineName: "IPV",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 270),
//           }, // IPV at 9 months
//           {
//             vaccineName: "PCV",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 45),
//           }, // PCV at 1.5 months
//           {
//             vaccineName: "PCV",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 75),
//           }, // PCV at 2.5 months
//           {
//             vaccineName: "PCV",
//             doseNumber: 3,
//             schedule: addDays(dateOfBirth, 105),
//           }, // PCV at 3.5 months
//           {
//             vaccineName: "MMR",
//             doseNumber: 1,
//             schedule: addDays(dateOfBirth, 270),
//           }, // MMR at 9 months
//           {
//             vaccineName: "MMR",
//             doseNumber: 2,
//             schedule: addDays(dateOfBirth, 365),
//           }, // MMR at 12 months
//         ];

//         for (const vaccine of vaccineSchedules) {
//           // Skip the BCG and Hepatitis B vaccines for the Wednesday logic
//           const isBCGOrHepB =
//             vaccine.vaccineName === "BCG" ||
//             vaccine.vaccineName === "Hepatitis B";
//           const scheduledDate = isBCGOrHepB
//             ? vaccine.schedule
//             : getNextWednesday(vaccine.schedule);

//           const newSchedule = await SchedulingModel.create({
//             childId,
//             scheduleType: "vaccination",
//             scheduleDate: scheduledDate,
//             rescheduleDate: addDays(scheduledDate, 7),
//             location: "Barangay Health Center",
//             notificationSent: false,
//             notificationDate: addDays(scheduledDate, -2), // Notification 2 days before
//             motherPhoneNumber,
//             vaccineName: vaccine.vaccineName,
//             doseNumber: vaccine.doseNumber || 1,
//             remarks: `${vaccine.vaccineName} dose ${
//               vaccine.doseNumber || 1
//             } scheduled.`,
//           });

//           // Add the schedule to the child document
//           await ChildModel.findByIdAndUpdate(childId, {
//             $push: { schedules: newSchedule._id },
//           });
//         }
//       }

//       // Send response
//       res.send({ message: "Schedules created successfully for all children" });
//     } catch (error) {
//       res.status(500).send({ message: "Error generating schedule", error });
//     }
//   })
// );

// FIXME: Updated Schedules
// FIXME: Updated Schedules
// TODO: populate schedules

// Seed Vaccination
// Function to filter out future schedules and populate vaccinations for a specific child
// Function to filter out future schedules and populate vaccinations
// router.get(
//   "/populate-vaccinations/:childId",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       // Interface definition for schedule structure
//       interface SchedulingDocument {
//         scheduleType: string;
//         scheduleDate: Date;
//         vaccineName: string;
//         doseNumber: number;
//         location: string;
//       }

//       const childId = req.params.childId;

//       // Fetch the child by ID and fully populate the schedules
//       const child = await ChildModel.findById(childId)
//         .populate("schedules")
//         .exec();

//       // Handle case where child is not found
//       if (!child) {
//         res.status(404).send({ message: "Child not found." });
//       }

//       const today = new Date();
//       const midwifeId = "66dfe2205309a42e3710c6af"; // Replace with the actual midwife ID

//       // Fetch all BHW users from the database
//       const bhws = await UserModel.find({ role: "bhw" }).select("id").exec();
//       if (!bhws || bhws.length === 0) {
//         res.status(404).send({ message: "No BHWs found." });
//       }
//       let pastVaccinationSchedules: any;
//       // Type assertion to ensure schedules are treated as an array of Scheduling documents
//       // Check if schedules is an array and cast it correctly
//       if (Array.isArray(child?.schedules)) {
//         pastVaccinationSchedules =
//           (child?.schedules as unknown as SchedulingDocument[]).filter(
//             (schedule) =>
//               schedule.scheduleType === "vaccination" &&
//               schedule.scheduleDate <= today
//           ) ?? [];

//         // Proceed with your logic for pastVaccinationSchedules
//       }

//       // Loop through past vaccination schedules
//       for (const schedule of pastVaccinationSchedules) {
//         // Randomly select a BHW ID from the list
//         const randomBhwId = bhws[Math.floor(Math.random() * bhws.length)]._id;

//         // Create a vaccination record based on the schedule
//         const newVaccination = await VaccinationModel.create({
//           vaccineType: schedule.vaccineName,
//           doseNumber: schedule.doseNumber,
//           placeOfVaccination: schedule.location,
//           dateOfVaccination: schedule.scheduleDate,
//           midwifeId: midwifeId, // Set the fixed midwife ID
//           bhwId: randomBhwId, // Set the random BHW ID
//         });

//         // Link the new vaccination to the child
//         await ChildModel.findByIdAndUpdate(child?.id, {
//           $push: { vaccinations: newVaccination.id },
//         });
//       }

//       // Send success response
//       res.send({
//         message:
//           "Vaccination records created successfully for child: " + childId,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ message: "Error populating vaccinations", error });
//     }
//   })
// );

// FIXME: Vaccination
// FIXME: Vaccination
// FIXME: Vaccination
// FIXME: Vaccination

// FIXME: Delete vaccination
// router.get(
//   "/delete-all-vaccinations",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       // Fetch all children
//       const children = await ChildModel.find();

//       if (!children || children.length === 0) {
//         res.status(404).send({ message: "No children found." });
//       }

//       // Loop through each child
//       for (const child of children) {
//         // If the child has vaccinations, delete them
//         if (child.vaccinations && child.vaccinations.length > 0) {
//           // Delete the vaccination records from VaccinationModel
//           await VaccinationModel.deleteMany({
//             _id: { $in: child.vaccinations },
//           });

//           // Clear the child's vaccinations array
//           await ChildModel.findByIdAndUpdate(child._id, {
//             $set: { vaccinations: [] },
//           });
//         }
//       }

//       // Send success response
//       res.send({
//         message: "All vaccinations have been deleted for all children.",
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ message: "Error deleting vaccinations", error });
//     }
//   })
// );

// TODO: Populate vaccinations
// router.get(
//   "/populate-vaccinations",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       // Interface definition for schedule structure
//       interface SchedulingDocument {
//         scheduleType: string;
//         scheduleDate: Date;
//         vaccineName: string;
//         doseNumber: number;
//         location: string;
//       }

//       // Fetch all children from the database
//       const children = await ChildModel.find().populate("schedules").exec();

//       // Handle case where no children are found
//       if (!children || children.length === 0) {
//         res.status(404).send({ message: "No children found." });
//       }

//       const today = new Date();
//       const midwifeId = "66dfe2205309a42e3710c6af"; // Replace with the actual midwife ID

//       // Fetch all BHW users from the database
//       const bhws = await UserModel.find({ role: "bhw" }).select("id").exec();
//       if (!bhws || bhws.length === 0) {
//         res.status(404).send({ message: "No BHWs found." });
//       }

//       // Loop through each child to populate their vaccinations
//       for (const child of children) {
//         let pastVaccinationSchedules: SchedulingDocument[] = [];

//         // Type assertion to ensure schedules are treated as an array of Scheduling documents
//         if (Array.isArray(child.schedules)) {
//           pastVaccinationSchedules =
//             (child.schedules as unknown as SchedulingDocument[]).filter(
//               (schedule) =>
//                 schedule.scheduleType === "vaccination" &&
//                 schedule.scheduleDate <= today
//             ) ?? [];

//           // Proceed with your logic for pastVaccinationSchedules
//         }

//         // Loop through past vaccination schedules and create vaccination records
//         for (const schedule of pastVaccinationSchedules) {
//           // Randomly select a BHW ID from the list
//           const randomBhwId = bhws[Math.floor(Math.random() * bhws.length)].id;

//           // Create a vaccination record based on the schedule
//           const newVaccination = await VaccinationModel.create({
//             vaccineType: schedule.vaccineName,
//             doseNumber: schedule.doseNumber,
//             placeOfVaccination: schedule.location,
//             dateOfVaccination: schedule.scheduleDate,
//             midwifeId: midwifeId, // Set the fixed midwife ID
//             bhwId: randomBhwId, // Set the random BHW ID
//           });

//           // Append the new vaccination _id to the child's vaccination array
//           await ChildModel.findByIdAndUpdate(
//             child.id, // Keep the original _id unchanged
//             { $push: { vaccinations: newVaccination.id } } // Append new vaccination
//           );
//         }
//       }

//       // Send success response
//       res.send({
//         message: "Vaccination records created successfully for all children.",
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ message: "Error populating vaccinations", error });
//     }
//   })
// );

// FIXME: Vaccination
// FIXME: Vaccination
// FIXME: Vaccination
// FIXME: Vaccination

// Get all child and filter
router.get(
  "/child",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const {
      gender,
      purok,
      nutritionalStatus,
      heightForAge,
      weightForAge,
      weightForLength,
      vaxStatus,
    } = req.query; // Capture filters from query parameters

    // Build filter object dynamically based on query parameters
    const filter: any = {};

    // 1. Gender filter
    if (gender) filter.gender = gender; // Filter by gender if provided

    // 2. Purok filter
    if (purok) filter.purok = purok; // Filter by purok if provided

    // 3. Anthropometric filter (for nutritional status)
    if (heightForAge || weightForAge || weightForLength) {
      filter["anthropometric"] = {};
      if (heightForAge) filter["anthropometric.heightForAge"] = heightForAge;
      if (weightForAge) filter["anthropometric.weightForAge"] = weightForAge;
      if (weightForLength)
        filter["anthropometric.weightForHeight"] = weightForLength;
    }

    // Fetch all children initially
    const children = await ChildModel.find(filter)
      // .populate("vaccinations") // Populate vaccination data
      .populate("vaccinations")
      .populate("anthropometricStatus") // Populate anthropometric data
      .populate("weighingHistory") // Populate weighing history
      .populate("nutritionalStatus"); // Populate weighing history

    // 4. Apply vaccination status filter based on vaccination count
    // if (nutritionalStatus) {
    //   filter["nutritionalStatus.status"] = nutritionalStatus;
    //   console.log(filter["nutritionalStatus.status"]);
    // }
    // In-memory filter for nutritionalStatus after populating

    let filteredChildren = children;

    interface Nuts {
      nutritionalStatus?: any;
    }

    if (nutritionalStatus) {
      filteredChildren = children.filter(
        (child: Nuts) => child.nutritionalStatus?.status === nutritionalStatus
      );
    }

    if (vaxStatus) {
      filteredChildren = children.filter((child) => {
        const requiredVaccines = 15; // Number of vaccines required

        // Calculate the one year and six weeks after birth
        const oneYearAndSixWeeksAfterBirth = new Date(child.dateOfBirth);
        oneYearAndSixWeeksAfterBirth.setFullYear(
          oneYearAndSixWeeksAfterBirth.getFullYear() + 1
        );
        oneYearAndSixWeeksAfterBirth.setDate(
          oneYearAndSixWeeksAfterBirth.getDate() + 42
        ); // Add 6 weeks (42 days)
        interface Vaccination {
          dateOfVaccination: Date;
        }
        // Count vaccinations within the time frame
        const vaccinationsWithinTimeFrame = (
          (child.vaccinations as unknown as Vaccination[]) || []
        ).filter((vaccine: Vaccination) => {
          const vaccineDate = new Date(vaccine.dateOfVaccination);
          return (
            vaccineDate >= new Date(child.dateOfBirth) &&
            vaccineDate <= oneYearAndSixWeeksAfterBirth
          );
        }).length;

        // Determine vaccination status
        let vaccinationStatus;
        if (vaccinationsWithinTimeFrame >= requiredVaccines) {
          vaccinationStatus = "Fully Vaccinated";
        } else if (vaccinationsWithinTimeFrame > 0) {
          vaccinationStatus = "Partially Vaccinated";
        } else {
          vaccinationStatus = "Not Vaccinated";
        }

        // Apply the vaxStatus filter
        if (
          vaxStatus === "Fully Vaccinated" &&
          vaccinationStatus === "Fully Vaccinated"
        ) {
          return true;
        } else if (
          vaxStatus === "Partially Vaccinated" &&
          vaccinationStatus === "Partially Vaccinated"
        ) {
          return true;
        } else if (
          vaxStatus === "Not Vaccinated" &&
          vaccinationStatus === "Not Vaccinated"
        ) {
          return true;
        }

        return false; // Child doesn't match the vaxStatus filter
      });
    }

    res.send(filteredChildren); // Send the filtered results
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
      .populate("nutritionalStatus")
      .populate("motherId", "firstName lastName")
      .populate("schedules")
      .populate({
        path: "vaccinations",
        populate: [
          { path: "midwifeId", select: "firstName lastName" }, // Populate midwife details
          { path: "bhwId", select: "firstName lastName" }, // Populate BHW details
        ],
      });
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

// Schedules
router.get(
  "/all-schedules",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    try {
      // Fetch all children and populate their schedules
      const children = await ChildModel.find()
        .populate("schedules")
        .populate("weighingHistory");

      if (!children.length) {
        res.status(404).send({ message: "No schedules found." });
      }
      // console.log("Children with schedules:", children); // Add this to check
      res.send({ children });
    } catch (error) {
      res.status(500).send({ message: "Error fetching schedules", error });
    }
  })
);

// Schedules
// router.get(
//   "/all-schedules",
//   authMiddleware,
//   loggerMiddleware,
//   expressAsyncHandler(async (req, res) => {
//     try {
//       // Fetch all children and populate their schedules and latest weighing history
//       const children = await ChildModel.find()
//         .populate({
//           path: "schedules",
//           model: SchedulingModel, // Populate the schedule data
//         })
//         .populate({
//           path: "weighingHistory",
//           model: WeighingHistoryModel, // Populate the weighing history data
//           options: { sort: { date: -1 }, limit: 1 }, // Get the latest entry
//         })
//         .select(
//           "firstName lastName gender dateOfBirth schedules weighingHistory"
//         ); // Select relevant fields
//       console.log("Fetched children:", children); // Check populated data
//       // Process data to add additional fields
//       const processedChildren = children.map((child) => {
//         // Calculate age in months
//         const ageInMonths = Math.floor(
//           (new Date().getTime() - new Date(child.dateOfBirth).getTime()) /
//             (1000 * 60 * 60 * 24 * 30.44) // Approximate month length
//         );

//         interface LatestWeigh {
//           childId: any; // Link to the child
//           scheduleType: "weighing" | "vaccination"; // Type of event
//           scheduleDate: Date; // Date for weighing or vaccination
//           rescheduleDate?: Date; // Reschedule date if missed
//           location: string; // Location of the event
//           notificationSent?: boolean; // If notification was sent
//           notificationDate?: Date; // Date when the SMS was sent
//           notificationContent?: string; // Content of the SMS
//           motherPhoneNumber: string; // Mother's phone number
//           vaccineName?: string; // Name of the vaccine (for vaccination schedules)
//           doseNumber?: number; // Dose number (for vaccines that require multiple doses)
//           weighingDescription?: string; // Weighing description for events
//           remarks?: string; // Additional notes if needed
//         }
//         interface LatestWeighing {
//           height: number;
//           weight: number;
//           date: Date;
//           weightForAge: string;
//           heightForAge: string;
//           weightForLengthHeight: string;
//           notes?: string;
//         }
//         // Get latest weight and height from weighingHistory if available
//         const latestWeighing = child.weighingHistory[0] as unknown as
//           | LatestWeighing
//           | undefined; // Access the latest record

//         const enrichedSchedules = child.schedules.map((schedule) => ({
//           ...(schedule as unknown as LatestWeigh),
//           ageInMonths: ageInMonths,
//           gender: child.gender,
//           height: latestWeighing?.height || null, // Use latest height if available
//           weight: latestWeighing?.weight || null, // Use latest weight if available
//         }));

//         return {
//           _id: child._id,
//           firstName: child.firstName,
//           lastName: child.lastName,
//           schedules: enrichedSchedules,
//         };
//       });

//       if (!processedChildren.length) {
//         res.status(404).send({ message: "No schedules found." });
//       }

//       res.send({ children: processedChildren });
//     } catch (error) {
//       res.status(500).send({ message: "Error fetching schedules", error });
//     }
//   })
// );

// Delete
// router.delete(
//   "/child/:id",
//   authMiddleware,
//   loggerMiddleware,
//   expressAsyncHandler(async (req, res) => {
//     const childId = req.params.id;
//     const deletedChild = await ChildModel.findByIdAndDelete(childId);

//     if (!deletedChild) {
//       res.status(HTTP_NOT_FOUND).send({ message: "Child not found" });
//     } else {
//       res.send({ message: "Child deleted successfully" });
//     }
//   })
// );

router.delete(
  "/child/:id",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const childId = req.params.id;

    // Find and delete the child
    const deletedChild = await ChildModel.findByIdAndDelete(childId);

    if (!deletedChild) {
      res.status(HTTP_NOT_FOUND).send({ message: "Child not found" });
    }

    // Delete related schedules
    await SchedulingModel.deleteMany({ childId: childId });

    // Delete related weighing history
    await WeighingHistoryModel.deleteMany({ childId: childId });

    // Delete related vaccinations
    await VaccinationModel.deleteMany({ childId: childId });

    // Delete missed vaccines (if applicable)
    await MissedVaccineModel.deleteMany({ childId: childId });

    await AnthropometricModel.deleteMany({ childId: childId });
    await NutritionalStatusModel.deleteMany({ childId: childId });

    // You can add more deletions if needed for other related models like anthropometricStatus, etc.

    res.send({ message: "Child and related data deleted successfully" });
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

// async function populateChildSchedules(child: any) {
//   const childId = child._id;
//   const dateOfBirth = new Date(child.dateOfBirth);

//   // Fetch the mother's phone number for notifications
//   const mother = await MotherModel.findOne({ children: childId }).select(
//     "phone"
//   );
//   if (!mother)
//     throw new Error(`Mother not found for child with ID: ${childId}`);

//   const motherPhoneNumber = mother.phone;
//   const schedules = [];

//   // 1. Generate Weighing Schedules (Annually until 5 years old)
//   for (let year = 0; year < 5; year++) {
//     const weighingDate = new Date(dateOfBirth.getFullYear() + year, 0, 14); // Weighing on January 14th
//     const newWeighingSchedule = await SchedulingModel.create({
//       childId,
//       scheduleType: "weighing",
//       scheduleDate: weighingDate,
//       rescheduleDate: addDays(weighingDate, 7),
//       location: "Barangay Health Center",
//       notificationSent: false,
//       notificationDate: addDays(weighingDate, -2), // Notification 2 days before
//       motherPhoneNumber,
//       remarks: `Weighing scheduled for year ${year}`,
//     });
//     console.log("Weighing schedule created:", newWeighingSchedule);
//     schedules.push(newWeighingSchedule);
//   }

//   // 2. Generate Vaccination Schedules
//   const vaccineSchedules = [
//     { vaccineName: "BCG", schedule: dateOfBirth }, // BCG at birth
//     { vaccineName: "Hepatitis B", schedule: dateOfBirth }, // Hepatitis B at birth
//     {
//       vaccineName: "Pentavalent",
//       doseNumber: 1,
//       schedule: addDays(dateOfBirth, 45),
//     }, // 1.5 months
//     {
//       vaccineName: "Pentavalent",
//       doseNumber: 2,
//       schedule: addDays(dateOfBirth, 75),
//     }, // 2.5 months
//     {
//       vaccineName: "Pentavalent",
//       doseNumber: 3,
//       schedule: addDays(dateOfBirth, 105),
//     }, // 3.5 months
//     { vaccineName: "OPV", doseNumber: 1, schedule: addDays(dateOfBirth, 45) }, // 1.5 months
//     { vaccineName: "OPV", doseNumber: 2, schedule: addDays(dateOfBirth, 75) }, // 2.5 months
//     { vaccineName: "OPV", doseNumber: 3, schedule: addDays(dateOfBirth, 105) }, // 3.5 months
//     { vaccineName: "IPV", doseNumber: 1, schedule: addDays(dateOfBirth, 105) }, // IPV at 3.5 months
//     { vaccineName: "IPV", doseNumber: 2, schedule: addDays(dateOfBirth, 270) }, // IPV at 9 months
//     { vaccineName: "PCV", doseNumber: 1, schedule: addDays(dateOfBirth, 45) }, // PCV at 1.5 months
//     { vaccineName: "PCV", doseNumber: 2, schedule: addDays(dateOfBirth, 75) }, // PCV at 2.5 months
//     { vaccineName: "PCV", doseNumber: 3, schedule: addDays(dateOfBirth, 105) }, // PCV at 3.5 months
//     { vaccineName: "MMR", doseNumber: 1, schedule: addDays(dateOfBirth, 270) }, // MMR at 9 months
//     { vaccineName: "MMR", doseNumber: 2, schedule: addDays(dateOfBirth, 365) }, // MMR at 12 months
//   ];

//   for (const vaccine of vaccineSchedules) {
//     const isBCGOrHepB =
//       vaccine.vaccineName === "BCG" || vaccine.vaccineName === "Hepatitis B";
//     const scheduledDate = isBCGOrHepB
//       ? vaccine.schedule
//       : getNextWednesday(vaccine.schedule);

//     const newVaccineSchedule = await SchedulingModel.create({
//       childId,
//       scheduleType: "vaccination",
//       scheduleDate: scheduledDate,
//       rescheduleDate: addDays(scheduledDate, 7),
//       location: "Barangay Health Center",
//       notificationSent: false,
//       notificationDate: addDays(scheduledDate, -2),
//       motherPhoneNumber,
//       vaccineName: vaccine.vaccineName,
//       doseNumber: vaccine.doseNumber || 1,
//       remarks: `${vaccine.vaccineName} dose ${
//         vaccine.doseNumber || 1
//       } scheduled.`,
//     });

//     schedules.push(newVaccineSchedule);
//   }

//   return schedules;
// }

// Automatically populates the child schedule
// helper to add days to a date

// async function populateChildSchedules(child: any) {
//   const childId = child._id;
//   const dateOfBirth = new Date(child.dateOfBirth);

//   // Fetch the mother's phone number for notifications
//   const mother = await MotherModel.findOne({ children: childId }).select(
//     "phone"
//   );
//   if (!mother)
//     throw new Error(`Mother not found for child with ID: ${childId}`);

//   const motherPhoneNumber = mother.phone;
//   const scheduleIds = []; // Array to store all schedule ObjectIds

//   // 1. Generate Weighing Schedules (Annually until 5 years old)
//   for (let year = 0; year < 5; year++) {
//     const weighingDate = new Date(dateOfBirth.getFullYear() + year, 0, 14); // Weighing on January 14th
//     const newWeighingSchedule = await SchedulingModel.create({
//       childId,
//       scheduleType: "weighing",
//       scheduleDate: weighingDate,
//       rescheduleDate: addDays(weighingDate, 7),
//       location: "Barangay Health Center",
//       notificationSent: false,
//       notificationDate: addDays(weighingDate, -2), // Notification 2 days before
//       motherPhoneNumber,
//       remarks: `Weighing scheduled for year ${year}`,
//     });
//     console.log("Weighing schedule created:", newWeighingSchedule);
//     scheduleIds.push(newWeighingSchedule._id); // Collect ObjectId of created schedule
//   }

//   // 2. Generate Vaccination Schedules
//   const vaccineSchedules = [
//     { vaccineName: "BCG", schedule: dateOfBirth }, // BCG at birth
//     { vaccineName: "Hepatitis B", schedule: dateOfBirth }, // Hepatitis B at birth
//     {
//       vaccineName: "Pentavalent",
//       doseNumber: 1,
//       schedule: addDays(dateOfBirth, 45),
//     }, // 1.5 months
//     {
//       vaccineName: "Pentavalent",
//       doseNumber: 2,
//       schedule: addDays(dateOfBirth, 75),
//     }, // 2.5 months
//     {
//       vaccineName: "Pentavalent",
//       doseNumber: 3,
//       schedule: addDays(dateOfBirth, 105),
//     }, // 3.5 months
//     { vaccineName: "OPV", doseNumber: 1, schedule: addDays(dateOfBirth, 45) }, // 1.5 months
//     { vaccineName: "OPV", doseNumber: 2, schedule: addDays(dateOfBirth, 75) }, // 2.5 months
//     { vaccineName: "OPV", doseNumber: 3, schedule: addDays(dateOfBirth, 105) }, // 3.5 months
//     { vaccineName: "IPV", doseNumber: 1, schedule: addDays(dateOfBirth, 105) }, // IPV at 3.5 months
//     { vaccineName: "IPV", doseNumber: 2, schedule: addDays(dateOfBirth, 270) }, // IPV at 9 months
//     { vaccineName: "PCV", doseNumber: 1, schedule: addDays(dateOfBirth, 45) }, // PCV at 1.5 months
//     { vaccineName: "PCV", doseNumber: 2, schedule: addDays(dateOfBirth, 75) }, // PCV at 2.5 months
//     { vaccineName: "PCV", doseNumber: 3, schedule: addDays(dateOfBirth, 105) }, // PCV at 3.5 months
//     { vaccineName: "MMR", doseNumber: 1, schedule: addDays(dateOfBirth, 270) }, // MMR at 9 months
//     { vaccineName: "MMR", doseNumber: 2, schedule: addDays(dateOfBirth, 365) }, // MMR at 12 months
//   ];

//   for (const vaccine of vaccineSchedules) {
//     const isBCGOrHepB =
//       vaccine.vaccineName === "BCG" || vaccine.vaccineName === "Hepatitis B";
//     const scheduledDate = isBCGOrHepB
//       ? vaccine.schedule
//       : getNextWednesday(vaccine.schedule);

//     const newVaccineSchedule = await SchedulingModel.create({
//       childId,
//       scheduleType: "vaccination",
//       scheduleDate: scheduledDate,
//       rescheduleDate: addDays(scheduledDate, 7),
//       location: "Barangay Health Center",
//       notificationSent: false,
//       notificationDate: addDays(scheduledDate, -2),
//       motherPhoneNumber,
//       vaccineName: vaccine.vaccineName,
//       doseNumber: vaccine.doseNumber || 1,
//       remarks: `${vaccine.vaccineName} dose ${
//         vaccine.doseNumber || 1
//       } scheduled.`,
//     });

//     scheduleIds.push(newVaccineSchedule._id); // Collect ObjectId of created schedule
//   }

//   // Update the child with all the schedule ObjectIds in one go
//   await ChildModel.findByIdAndUpdate(childId, {
//     $push: { schedules: { $each: scheduleIds } }, // Add all schedule ObjectIds at once
//   });

//   return scheduleIds;
// }

// hjk

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Helper function to get the next Wednesday
function getNextWednesday(date: Date): Date {
  const dayOfWeek = date.getDay(); // Get the current day of the week (0 = Sunday, ..., 6 = Saturday)
  const daysUntilWednesday = (3 - dayOfWeek + 7) % 7; // 3 is the index for Wednesday
  return addDays(date, daysUntilWednesday);
}
async function populateChildSchedules(child: any) {
  const childId = child._id;
  const dateOfBirth = new Date(child.dateOfBirth);

  // Fetch the mother's phone number for notifications
  const mother = await MotherModel.findOne({ children: childId }).select(
    "phone"
  );
  if (!mother)
    throw new Error(`Mother not found for child with ID: ${childId}`);

  const motherPhoneNumber = mother.phone;
  const scheduleIds = []; // Array to store all schedule ObjectIds

  // // 1. Generate Weighing Schedules (Annually until 5 years old)
  // for (let year = 0; year < 5; year++) {
  //   const weighingDate = new Date(dateOfBirth.getFullYear() + year, 0, 14); // Weighing on January 14th
  //   console.log(weighingDate);
  //   const newWeighingSchedule = await SchedulingModel.create({
  //     childId,
  //     scheduleType: "weighing",
  //     scheduleDate: weighingDate,
  //     rescheduleDate: addDays(weighingDate, 7),
  //     location: "Barangay Health Center",
  //     notificationSent: false,
  //     notificationDate: addDays(weighingDate, -2), // Notification 2 days before
  //     motherPhoneNumber,
  //     remarks: `Weighing scheduled for year ${year}`,
  //   });
  //   scheduleIds.push(newWeighingSchedule._id); // Collect ObjectId of created schedule
  // }

  // Generate Weighing Schedules (Monthly until 5 years old)
  for (let month = 0; month < 60; month++) {
    // Calculate the weighing date by adding the month offset to the date of birth
    const weighingDate = new Date(
      dateOfBirth.getFullYear(),
      dateOfBirth.getMonth() + month,
      14
    ); // Weighing on the 14th of each month

    console.log(weighingDate);

    const newWeighingSchedule = await SchedulingModel.create({
      childId,
      scheduleType: "weighing",
      scheduleDate: weighingDate,
      rescheduleDate: addDays(weighingDate, 7), // Reschedule 7 days later
      location: "Barangay Health Center",
      notificationSent: false,
      notificationDate: addDays(weighingDate, -2), // Notification 2 days before
      motherPhoneNumber,
      remarks: `Weighing scheduled for month ${month + 1}`,
    });

    scheduleIds.push(newWeighingSchedule._id); // Collect ObjectId of created schedule
  }

  // 2. Generate Vaccination Schedules (Birth - 12 months)
  const vaccineSchedules = [
    { vaccineName: "BCG", schedule: dateOfBirth }, // BCG at birth
    { vaccineName: "Hepatitis B", schedule: dateOfBirth }, // Hepatitis B at birth
    {
      vaccineName: "Pentavalent",
      doseNumber: 1,
      schedule: addDays(dateOfBirth, 45),
    }, // 1.5 months
    {
      vaccineName: "Pentavalent",
      doseNumber: 2,
      schedule: addDays(dateOfBirth, 75),
    }, // 2.5 months
    {
      vaccineName: "Pentavalent",
      doseNumber: 3,
      schedule: addDays(dateOfBirth, 105),
    }, // 3.5 months
    { vaccineName: "OPV", doseNumber: 1, schedule: addDays(dateOfBirth, 45) }, // 1.5 months
    { vaccineName: "OPV", doseNumber: 2, schedule: addDays(dateOfBirth, 75) }, // 2.5 months
    { vaccineName: "OPV", doseNumber: 3, schedule: addDays(dateOfBirth, 105) }, // 3.5 months
    { vaccineName: "IPV", doseNumber: 1, schedule: addDays(dateOfBirth, 105) }, // IPV at 3.5 months
    { vaccineName: "IPV", doseNumber: 2, schedule: addDays(dateOfBirth, 270) }, // IPV at 9 months
    { vaccineName: "PCV", doseNumber: 1, schedule: addDays(dateOfBirth, 45) }, // PCV at 1.5 months
    { vaccineName: "PCV", doseNumber: 2, schedule: addDays(dateOfBirth, 75) }, // PCV at 2.5 months
    { vaccineName: "PCV", doseNumber: 3, schedule: addDays(dateOfBirth, 105) }, // PCV at 3.5 months
    { vaccineName: "MMR", doseNumber: 1, schedule: addDays(dateOfBirth, 270) }, // MMR at 9 months
    { vaccineName: "MMR", doseNumber: 2, schedule: addDays(dateOfBirth, 365) }, // MMR at 12 months
  ];

  for (const vaccine of vaccineSchedules) {
    const isBCGOrHepB =
      vaccine.vaccineName === "BCG" || vaccine.vaccineName === "Hepatitis B";
    const scheduledDate = isBCGOrHepB
      ? vaccine.schedule
      : getNextWednesday(vaccine.schedule);

    const newVaccineSchedule = await SchedulingModel.create({
      childId,
      scheduleType: "vaccination",
      scheduleDate: scheduledDate,
      rescheduleDate: addDays(scheduledDate, 7),
      location: "Barangay Health Center",
      notificationSent: false,
      notificationDate: addDays(scheduledDate, -2),
      motherPhoneNumber,
      vaccineName: vaccine.vaccineName,
      doseNumber: vaccine.doseNumber || 1,
      remarks: `${vaccine.vaccineName} dose ${
        vaccine.doseNumber || 1
      } scheduled.`,
    });

    scheduleIds.push(newVaccineSchedule._id); // Collect ObjectId of created schedule
  }

  // 3. Generate Vaccination Schedules for Grade 1 and Grade 7
  const gradeVaccines = [
    {
      vaccineName: "MCV",
      doseNumber: 1,
      schedule: addDays(dateOfBirth, 6 * 365), // MCV Grade 1
    },
    {
      vaccineName: "MCV",
      doseNumber: 2,
      schedule: addDays(dateOfBirth, 12 * 365), // MCV Grade 7
    },
    {
      vaccineName: "TD",
      doseNumber: 1,
      schedule: addDays(dateOfBirth, 6 * 365), // TD Grade 1
    },
    {
      vaccineName: "TD",
      doseNumber: 2,
      schedule: addDays(dateOfBirth, 12 * 365), // TD Grade 7
    },
  ];

  for (const vaccine of gradeVaccines) {
    const newGradeVaccineSchedule = await SchedulingModel.create({
      childId,
      scheduleType: "vaccination",
      scheduleDate: getNextWednesday(vaccine.schedule),
      rescheduleDate: addDays(getNextWednesday(vaccine.schedule), 7),
      location: "Barangay Health Center",
      notificationSent: false,
      notificationDate: addDays(getNextWednesday(vaccine.schedule), -2),
      motherPhoneNumber,
      vaccineName: vaccine.vaccineName,
      doseNumber: vaccine.doseNumber || 1,
      remarks: `${vaccine.vaccineName} dose ${
        vaccine.doseNumber || 1
      } scheduled for Grade ${vaccine.doseNumber === 1 ? "1" : "7"}`,
    });

    scheduleIds.push(newGradeVaccineSchedule._id); // Collect ObjectId of created schedule
  }

  // 4. Additional Vaccines for Female Children (HPV)
  if (child.gender === "Female") {
    const hpvVaccineSchedules = [
      {
        vaccineName: "Human Papillomavirus Vaccine (HPV)",
        doseNumber: 1,
        schedule: addDays(dateOfBirth, 9 * 365), // HPV Grade 4
      },
      {
        vaccineName: "Human Papillomavirus Vaccine (HPV)",
        doseNumber: 2,
        schedule: addDays(dateOfBirth, 10 * 365), // HPV 2nd dose - 1 year later
      },
    ];

    for (const hpv of hpvVaccineSchedules) {
      const newHPVSchedule = await SchedulingModel.create({
        childId,
        scheduleType: "vaccination",
        scheduleDate: getNextWednesday(hpv.schedule),
        rescheduleDate: addDays(getNextWednesday(hpv.schedule), 7),
        location: "Barangay Health Center",
        notificationSent: false,
        notificationDate: addDays(getNextWednesday(hpv.schedule), -2),
        motherPhoneNumber,
        vaccineName: hpv.vaccineName,
        doseNumber: hpv.doseNumber,
        remarks: `${hpv.vaccineName} dose ${hpv.doseNumber} scheduled for Grade 4 (female only)`,
      });

      scheduleIds.push(newHPVSchedule._id); // Collect ObjectId of created schedule
    }
  }

  // Update the child with all the schedule ObjectIds in one go
  await ChildModel.findByIdAndUpdate(childId, {
    $push: { schedules: { $each: scheduleIds } }, // Add all schedule ObjectIds at once
  });

  return scheduleIds;
}

// TODO:
// Add child
router.post(
  "/child/add",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    console.log(req.body); // Check if motherId is present here
    const { motherId, ...childData } = req.body;

    // Add the child to the database
    const newChild = await ChildModel.create({ ...childData, motherId });

    // Link the child to the mother
    await MotherModel.findByIdAndUpdate(motherId, {
      $push: { children: newChild._id },
    });

    // Populate schedules for this specific child
    const schedules = await populateChildSchedules(newChild);

    res.status(201).send({ newChild, schedules });
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

// Add Vaccination
router.post(
  "/child/:id/vaccination",
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    const childId = req.params.id; // Get the child ID from the route params

    const {
      vaccineType,
      doseNumber,
      placeOfVaccination,
      dateOfVaccination,
      midwifeId,
      bhwId,
    } = req.body; // Get vaccination details from the request body

    // Create a new vaccination record
    const vaccination = await VaccinationModel.create({
      vaccineType,
      doseNumber,
      placeOfVaccination,
      dateOfVaccination,
      midwifeId,
      bhwId,
    });

    // Link the vaccination to the child
    await ChildModel.findByIdAndUpdate(childId, {
      $push: { vaccinations: vaccination._id },
    });

    res.status(201).send({ vaccination });
  })
);

// Add Anthropometric
// Add Anthropometric Data
router.post(
  "/child/:id/anthropometric",
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    const childId = req.params.id;

    // Map incoming fields to match the schema requirements
    const weightForAge = req.body.weightForAgeStatus;
    const heightForAge = req.body.lengthForAgeStatus;
    const weightForHeight = req.body.weightForLengthStatus;
    const dateOfWeighing = req.body.dateOfWeighing; // or use req.body.dateOfWeighing if provided from frontend

    try {
      // Create a new anthropometric data record with mapped fields
      const anthropometric = await AnthropometricModel.create({
        childId,
        weightForAge,
        heightForAge,
        weightForHeight,
        dateOfWeighing,
      });

      // Link the anthropometric data to the child record
      await ChildModel.findByIdAndUpdate(childId, {
        $set: { anthropometricStatus: anthropometric._id },
      });

      res.status(201).send({ anthropometric });
    } catch (error: any) {
      console.error("Error creating anthropometric data:", error);
      res.status(500).send({
        message:
          "Failed to add anthropometric assessment. Please check the input data.",
        error: error.message,
      });
    }
  })
);

// Add Weighing History
router.post(
  "/child/:id/weighing-history",
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    const childId = req.params.id;

    const weightForAge = req.body.weightForAgeStatus;
    const heightForAge = req.body.lengthForAgeStatus;
    const weightForLengthHeight = req.body.weightForLengthStatus;
    // const dateOfWeighing = req.body.dateOfWeighing;
    const weight = req.body.weight;
    const height = req.body.height;
    const date = req.body.date;

    try {
      // Create a new weighing history record
      const weighingHistory = await WeighingHistoryModel.create({
        child: childId,
        date,
        weight,
        height,
        weightForAge,
        heightForAge,
        weightForLengthHeight,
      });

      // Link the weighing history to the child
      await ChildModel.findByIdAndUpdate(childId, {
        $push: { weighingHistory: weighingHistory._id },
      });

      res.status(201).send({ weighingHistory });
    } catch (error: any) {
      console.error("Error creating weighing history:", error);
      res.status(500).send({
        message: "Failed to add weighing history. Please check the input data.",
        error: error.message,
      });
    }
  })
);

// Add Nutritional Status
router.post(
  "/child/:id/nutritional-status",
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    const childId = req.params.id;

    const { status, dateOfStatus } = req.body;

    try {
      // Create a new nutritional status record
      const nutritionalStatus = await NutritionalStatusModel.create({
        childId,
        status,
        dateOfStatus,
      });

      // Link the nutritional status to the child
      await ChildModel.findByIdAndUpdate(childId, {
        $set: { nutritionalStatus: nutritionalStatus._id },
      });

      res.status(201).send({ nutritionalStatus });
    } catch (error: any) {
      console.error("Error creating nutritional status:", error);
      res.status(500).send({
        message:
          "Failed to add nutritional status. Please check the input data.",
        error: error.message,
      });
    }
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
