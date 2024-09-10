import { connect, ConnectOptions } from "mongoose";

export const dbConnect = () => {
  connect(process.env.MONGO_URI!, {} as ConnectOptions).then(
    () => console.log("Connect Successfully"),
    (error) => console.log(error, "Not Good")
  );
};
