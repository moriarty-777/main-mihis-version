import { LogModel } from "../models/log.model";

export const getLogHistory = async (req: any, res: any) => {
  // const logs = await LogModel.find().sort({ timestamp: -1 }); // Fetch logs sorted by time
  // res.send(logs);
  try {
    const logs = await LogModel.find().sort({ timestamp: -1 });
    res.send(logs);
  } catch (error) {
    console.error("Error fetching logs:", error); // Log error
    res
      .status(500)
      .send({ message: "Internal server error while fetching logs" });
  }
};
