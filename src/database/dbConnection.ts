import mongoose from "mongoose";

const MONGODB = process.env.MONGODB;

if (!MONGODB) {
  throw new Error("MONGODB environment variable is required");
}

let connectionPromise: Promise<typeof mongoose> | null = null;

const dbConnect = () => {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGODB);
    console.log("MongoDB connection established");
  }
  console.log("MongoDB connection already established");
  return connectionPromise;
};

export default dbConnect;
