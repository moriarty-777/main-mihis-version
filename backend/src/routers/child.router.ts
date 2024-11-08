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
import { sendYearlyScheduleSMS } from "./sendsms.router";
import { AefiModel } from "../models/aefi.model";

const router = Router();

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

router.get(
  "/child/filtered",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const {
      nutritionalStatus,
      vaxStatus,
      startDate,
      endDate,
      filterType,
      purok,
      gender,
    } = req.query;

    console.log("Received query params:", {
      nutritionalStatus,
      vaxStatus,
      startDate,
      endDate,
      filterType,
      purok,
      gender,
    });

    // Base filter for common fields (purok, gender)
    const filter: any = {};
    if (purok && purok !== "null") filter.purok = purok;
    if (gender && gender !== "null") filter.gender = gender;

    let children;

    if (filterType === "malnutrition") {
      console.log("Applying malnutrition filter");

      // Add date filter for malnutrition based on `dateOfStatus`
      const nutritionalFilter: any = { dateOfStatus: {} };
      if (startDate)
        nutritionalFilter.dateOfStatus.$gte = new Date(startDate as string);
      if (endDate)
        nutritionalFilter.dateOfStatus.$lte = new Date(endDate as string);

      children = await ChildModel.find(filter)
        .populate({
          path: "nutritionalStatus",
          match: nutritionalFilter, // Apply date filter specifically to nutritional status
        })
        .populate("vaccinations") // Populate for other data if needed
        .populate("anthropometricStatus")
        .populate("weighingHistory");

      // Further filter children by nutritional status
      children = children.filter(
        (child: any) =>
          child.nutritionalStatus &&
          (!nutritionalStatus ||
            child.nutritionalStatus.status === nutritionalStatus)
      );

      console.log("Filtered Malnutrition Children:", children.length);
    } else if (filterType === "vaccination") {
      console.log("Applying vaccination filter");

      // Add date filter for vaccination based on `dateOfBirth`
      if (startDate || endDate) {
        filter.dateOfBirth = {};
        if (startDate) filter.dateOfBirth.$gte = new Date(startDate as string);
        if (endDate) filter.dateOfBirth.$lte = new Date(endDate as string);
      }

      children = await ChildModel.find(filter)
        .populate("vaccinations")
        .populate("anthropometricStatus")
        .populate("weighingHistory")
        .populate("nutritionalStatus"); // Populate for other data if needed

      // Filter children based on vaccination status
      const requiredVaccines = 15;
      children = children.filter((child) => {
        const vaccineCount = child.vaccinations.length;
        let vaccineStatus = "Not Vaccinated";

        if (vaccineCount >= requiredVaccines) {
          vaccineStatus = "Fully Vaccinated";
        } else if (vaccineCount > 0) {
          vaccineStatus = "Partially Vaccinated";
        }

        return (
          (!vaxStatus || vaccineStatus === vaxStatus) &&
          (!nutritionalStatus ||
            (child.nutritionalStatus as any).status === nutritionalStatus)
        );
      });
    }

    res.send(children);
  })
);

// Weighing summary filter
router.get(
  "/chold/nutritional-summary",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const { year, month, startDate, endDate } = req.query;

    console.log("Received Nutritional Summary Filter Parameters:");
    console.log("Year:", year);
    console.log("Month:", month);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const matchConditions: Record<string, any> = {};

    // Apply date range filtering
    if (startDate || endDate) {
      matchConditions.dateOfStatus = {};
      if (startDate && typeof startDate === "string") {
        matchConditions.dateOfStatus.$gte = new Date(startDate);
      }
      if (endDate && typeof endDate === "string") {
        matchConditions.dateOfStatus.$lte = new Date(endDate);
      }
    } else if (year && typeof year === "string") {
      // If only year is specified, filter by year
      const yearNumber = parseInt(year, 10);
      matchConditions.dateOfStatus = {
        $gte: new Date(`${yearNumber}-01-01`),
        $lte: new Date(`${yearNumber}-12-31`),
      };

      if (month && typeof month === "string") {
        // Add month filter if specified
        const monthNumber = parseInt(month, 10);
        if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
          matchConditions.dateOfStatus.$gte = new Date(
            `${yearNumber}-${monthNumber.toString().padStart(2, "0")}-01`
          );
          matchConditions.dateOfStatus.$lte = new Date(
            new Date(
              `${yearNumber}-${monthNumber.toString().padStart(2, "0")}-01`
            ).setMonth(monthNumber)
          );
        }
      }
    }

    const weighingAggregation = [
      { $match: matchConditions },
      {
        $group: {
          _id: {
            year: { $year: "$dateOfStatus" },
            ...(month !== null && month !== undefined
              ? { month: { $month: "$dateOfStatus" } }
              : {}),
          },
          normalCount: {
            $sum: { $cond: [{ $eq: ["$status", "Normal"] }, 1, 0] },
          },
          malnourishedCount: {
            $sum: { $cond: [{ $eq: ["$status", "Malnourished"] }, 1, 0] },
          },
        },
      },
    ];

    const weighingSummary = await NutritionalStatusModel.aggregate(
      weighingAggregation
    );
    res.send({ weighingSummary });
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
          { path: "bhwId", select: "firstName lastName" },
          { path: "aefi" }, // Populate BHW details
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

// Vaccination summary route in backend
router.get(
  "/child/vaccination-summary",
  expressAsyncHandler(async (req, res) => {
    const requiredVaccines = 15; // Define the required number of vaccines to be considered fully vaccinated

    // Retrieve all children with populated vaccinations
    const children = await ChildModel.find().populate("vaccinations");

    let fullyVaccinatedCount = 0;
    let partiallyVaccinatedCount = 0;
    let notVaccinatedCount = 0;
    interface vax {
      vaccinations: any;
    }
    children.forEach((child) => {
      const vaccinationCount = child.vaccinations?.length;

      if (vaccinationCount >= requiredVaccines) {
        fullyVaccinatedCount++;
      } else if (vaccinationCount > 0) {
        partiallyVaccinatedCount++;
      } else {
        notVaccinatedCount++;
      }
    });

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

    // Remove the child reference from the mother's children array
    await MotherModel.findByIdAndUpdate(deletedChild?.motherId, {
      $pull: { children: childId },
    });

    // Delete related schedules
    await SchedulingModel.deleteMany({ childId: childId });

    // Delete related weighing history
    await WeighingHistoryModel.deleteMany({ childId: childId });
    // TODO:
    // Retrieve all vaccinations for the child
    const childVaccinations = await VaccinationModel.find({ childId });

    // Delete AEFI records for each vaccination associated with the child
    const vaccinationIds = childVaccinations.map(
      (vaccination) => vaccination._id
    );
    await AefiModel.deleteMany({ vaccineId: { $in: vaccinationIds } });
    // TODO:
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
    console.log(
      "Schedule Date for each entry:",
      newWeighingSchedule.scheduleDate
    );
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
    const { motherId, ...childData } = req.body;

    // Add the child to the database
    const newChild = await ChildModel.create({ ...childData, motherId });
    // Link the child to the mother
    await MotherModel.findByIdAndUpdate(motherId, {
      $push: { children: newChild._id },
    });

    // Populate schedules for this specific child
    const schedules = await populateChildSchedules(newChild);
    const newChildWithSchedules = await ChildModel.findById(newChild._id)
      .populate("schedules") // This populates the schedules field with full schedule documents
      .exec();

    const mother = await MotherModel.findById(motherId); // get mother's details

    console.log("MMOTHER:", mother);
    if (mother && mother.phone) {
      await sendYearlyScheduleSMS(
        mother.phone,
        newChild,
        newChildWithSchedules?.schedules || [],
        mother
      );
    }

    res.status(201).send({ newChild: newChildWithSchedules, schedules });
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

// Add AEFI
// Add AEFI for a Vaccination
router.post(
  "/child/:vaccinationId/aefi",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    const { vaccinationId } = req.params;
    const { description, severity, dateOfEvent } = req.body;

    // Create a new AEFI record
    const aefi = await AefiModel.create({
      vaccineId: vaccinationId,
      description,
      severity,
      dateOfEvent,
    });

    // Update the vaccination to link with the created AEFI
    await VaccinationModel.findByIdAndUpdate(vaccinationId, {
      aefi: aefi._id,
    });

    res.status(201).send({ aefi });
  })
);

// In child router backend endpoint (child.router.js or similar file)
router.post(
  "/child/:id/missed-vaccine",
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    const childId = req.params.id;
    const { vaccineName, dateMissed, reason } = req.body;

    try {
      // Create a new missed vaccine record
      const missedVaccine = await MissedVaccineModel.create({
        childId,
        vaccineName,
        dateMissed,
        reason,
      });

      // Add the missed vaccine to the child document's missedVaccines array
      await ChildModel.findByIdAndUpdate(childId, {
        $push: { missedVaccines: missedVaccine._id },
      });

      // Update the related schedule's status to `true` (handled)
      const updatedSchedule = await SchedulingModel.findOneAndUpdate(
        { childId: childId, vaccineName: vaccineName }, // Adjust this criteria as needed
        { status: true },
        { new: true }
      );

      res.status(201).send({ missedVaccine, updatedSchedule });
    } catch (error: any) {
      console.error("Error creating missed vaccine:", error);
      res.status(500).send({
        message: "Failed to add missed vaccine. Please check the input data.",
        error: error.message,
      });
    }
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

// Update Scheduling Status
// Update Schedule Status
router.patch(
  "/child/schedules/:id/status",
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    const scheduleId = req.params.id;
    const { status } = req.body;

    try {
      const updatedSchedule = await SchedulingModel.findByIdAndUpdate(
        scheduleId,
        { status },
        { new: true }
      );
      res.status(200).send(updatedSchedule);
    } catch (error) {
      console.error("Error updating schedule status:", error);
      res.status(500).send({ message: "Failed to update schedule status." });
    }
  })
);

// Retrieve and update vaccination
// Fetch single vaccination by ID
router.get(
  "/child/:childId/vaccination/:vaccinationId",
  authMiddleware,
  async (req, res) => {
    const { childId, vaccinationId } = req.params;
    const vaccination = await VaccinationModel.findById(vaccinationId);
    if (!vaccination) {
      return res.status(404).json({ message: "Vaccination not found" });
    }
    res.json(vaccination);
  }
);

// Update vaccination by ID
router.patch(
  "/child/:childId/vaccination/:vaccinationId",
  authMiddleware,
  loggerMiddleware,
  async (req, res) => {
    const { childId, vaccinationId } = req.params;
    const updatedData = req.body;

    const vaccination = await VaccinationModel.findByIdAndUpdate(
      vaccinationId,
      updatedData,
      { new: true }
    );
    if (!vaccination) {
      return res.status(404).json({ message: "Vaccination not found" });
    }
    res.json(vaccination);
  }
);

// Update Nutritional Status Weighing History and Anthropometric
// Update Weighing History
router.patch(
  "/child/:childId/weighing-history/:weighingId",
  authMiddleware, // add your authentication middleware if necessary
  async (req, res) => {
    const { childId, weighingId } = req.params;
    const updatedData = req.body;

    try {
      const weighingHistory = await WeighingHistoryModel.findByIdAndUpdate(
        weighingId,
        updatedData,
        { new: true }
      );

      if (!weighingHistory) {
        return res.status(404).json({ message: "Weighing history not found" });
      }

      res.status(200).json({ weighingHistory });
    } catch (error: any) {
      console.error("Error updating weighing history:", error);
      res.status(500).json({
        message: "Failed to update weighing history",
        error: error.message,
      });
    }
  }
);

// Update Anthropometric Data
router.patch(
  "/child/:childId/anthropometric/:anthropometricId",
  authMiddleware, // add your authentication middleware if necessary
  async (req, res) => {
    const { childId, anthropometricId } = req.params;
    const updatedData = req.body;

    try {
      const anthropometric = await AnthropometricModel.findByIdAndUpdate(
        anthropometricId,
        updatedData,
        { new: true }
      );

      if (!anthropometric) {
        return res
          .status(404)
          .json({ message: "Anthropometric data not found" });
      }

      res.status(200).json({ anthropometric });
    } catch (error: any) {
      console.error("Error updating anthropometric data:", error);
      res.status(500).json({
        message: "Failed to update anthropometric data",
        error: error.message,
      });
    }
  }
);

// Update Nutritional Status
router.patch(
  "/child/:childId/nutritional-status/:nutritionalStatusId",
  authMiddleware, // add your authentication middleware if necessary
  async (req, res) => {
    const { childId, nutritionalStatusId } = req.params;
    const updatedData = req.body;

    try {
      const nutritionalStatus = await NutritionalStatusModel.findByIdAndUpdate(
        nutritionalStatusId,
        updatedData,
        { new: true }
      );

      if (!nutritionalStatus) {
        return res
          .status(404)
          .json({ message: "Nutritional status not found" });
      }

      res.status(200).json({ nutritionalStatus });
    } catch (error: any) {
      console.error("Error updating nutritional status:", error);
      res.status(500).json({
        message: "Failed to update nutritional status",
        error: error.message,
      });
    }
  }
);

// Get the vaccine
// Get Missed Vaccine Summary
router.get(
  "/missed-vaccine-summary",
  authMiddleware,
  loggerMiddleware,
  expressAsyncHandler(async (req, res) => {
    try {
      const missedVaccineSummary = await MissedVaccineModel.aggregate([
        {
          $group: {
            _id: "$vaccineName",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            vaccineName: "$_id",
            count: 1,
          },
        },
      ]);

      res.status(200).json(missedVaccineSummary);
    } catch (error: any) {
      console.error("Error fetching missed vaccine summary:", error);
      res.status(500).send({
        message: "Failed to retrieve missed vaccine summary.",
        error: error.message,
      });
    }
  })
);

// // New route for missed vaccine reporting
// TODO: NOW
router.get(
  "/report/missed-vaccines",
  expressAsyncHandler(async (req, res) => {
    try {
      // Fetch missed vaccines with child details
      const missedVaccinesReport = await ChildModel.aggregate([
        {
          $lookup: {
            from: "missedvaccines", // Collection name for missed vaccines
            localField: "_id",
            foreignField: "childId",
            as: "missedVaccines",
          },
        },
        {
          $match: {
            "missedVaccines.0": { $exists: true }, // Only children with missed vaccines
          },
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            purok: 1,
            gender: 1,
            missedVaccines: {
              vaccineName: 1,
              dateMissed: 1,
              reason: 1,
            },
          },
        },
      ]);

      res.status(200).json(missedVaccinesReport);
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to retrieve missed vaccine report.",
        error: error.message,
      });
    }
  })
);

// Analytics endpoint missed vaccine
// Vaccine coverage
router.get(
  "/report/vaccine-doses",
  expressAsyncHandler(async (req, res) => {
    try {
      const vaccineCounts = await SchedulingModel.aggregate([
        {
          $match: {
            scheduleType: "vaccination",
            status: true, // Only administered vaccines
          },
        },
        {
          $lookup: {
            from: "children", // The name of the child collection (may need to verify)
            localField: "childId",
            foreignField: "_id",
            as: "childInfo",
          },
        },
        {
          $unwind: "$childInfo",
        },
        {
          $group: {
            _id: {
              vaccineName: "$vaccineName",
              doseNumber: "$doseNumber",
              gender: "$childInfo.gender",
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              vaccineName: "$_id.vaccineName",
              doseNumber: "$_id.doseNumber",
            },
            maleCount: {
              $sum: {
                $cond: [{ $eq: ["$_id.gender", "Male"] }, "$count", 0],
              },
            },
            femaleCount: {
              $sum: {
                $cond: [{ $eq: ["$_id.gender", "Female"] }, "$count", 0],
              },
            },
            totalCount: { $sum: "$count" }, // Total for each dose regardless of gender
          },
        },
        {
          $project: {
            _id: 0,
            vaccineName: "$_id.vaccineName",
            doseNumber: "$_id.doseNumber",
            maleCount: 1,
            femaleCount: 1,
            totalCount: 1,
          },
        },
        {
          $sort: { vaccineName: 1, doseNumber: 1 },
        },
      ]);

      res.status(200).json(vaccineCounts);
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve vaccine dose data",
        error,
      });
    }
  })
);

// WEight for age
router.get(
  "/anthropometric-weight-for-age-by-child",

  expressAsyncHandler(async (req, res) => {
    try {
      const weightForAgeByChild = await AnthropometricModel.aggregate([
        {
          $group: {
            _id: { childId: "$childId", weightForAge: "$weightForAge" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            childId: "$_id.childId",
            weightForAge: "$_id.weightForAge",
            count: 1,
          },
        },
      ]);

      res.status(200).json(weightForAgeByChild);
    } catch (error: any) {
      console.error("Error fetching weight for age summary by child:", error);
      res.status(500).send({
        message: "Failed to retrieve weight for age summary by child.",
        error: error.message,
      });
    }
  })
);

// Height for age
router.get(
  "/anthropometric-height-for-age",
  expressAsyncHandler(async (req, res) => {
    try {
      const heightForAgeCounts = await AnthropometricModel.aggregate([
        {
          $group: {
            _id: { childId: "$childId", heightForAge: "$heightForAge" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.heightForAge",
            totalCount: { $sum: "$count" },
          },
        },
        {
          $project: {
            _id: 0,
            heightForAge: "$_id",
            count: "$totalCount",
          },
        },
      ]);

      res.status(200).json(heightForAgeCounts);
    } catch (error: any) {
      console.error("Error fetching height for age summary:", error);
      res.status(500).send({
        message: "Failed to retrieve height for age summary.",
        error: error.message,
      });
    }
  })
);

// weight for height
router.get(
  "/anthropometric-weight-for-height",
  expressAsyncHandler(async (req, res) => {
    try {
      const weightForHeightCounts = await AnthropometricModel.aggregate([
        {
          $group: {
            _id: { childId: "$childId", weightForHeight: "$weightForHeight" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.weightForHeight",
            totalCount: { $sum: "$count" },
          },
        },
        {
          $project: {
            _id: 0,
            weightForHeight: "$_id",
            count: "$totalCount",
          },
        },
      ]);

      res.status(200).json(weightForHeightCounts);
    } catch (error: any) {
      console.error("Error fetching weight-for-height data:", error);
      res.status(500).send({
        message: "Failed to retrieve weight-for-height data.",
        error: error.message,
      });
    }
  })
);

// Filter for analytics TODO: FIXME:

export default router;
