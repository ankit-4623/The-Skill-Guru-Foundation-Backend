import mongoose from "mongoose";
import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);


const connectDb = async () => {
  const url = process.env.MONGO_URI;

  if (!url) {
    throw new Error("MONGO_URI is not defined in enviroment variables");
  }

  try {
    await mongoose.connect(url, {
      dbName: "notedb",
    });
    console.log("Connected to mongodb");
  } catch (error) {
    console.error("Failed to connect to Mongodb", error);
    process.exit(1);
  }
};

export default connectDb;
