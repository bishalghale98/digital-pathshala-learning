import mongoose from "mongoose";

const MONGODB = process.env.MONGODB;

if (!MONGODB) {
  throw new Error("MONGODB environment variable is required");
}

let connectionPromise: Promise<typeof mongoose> | null = null;

const dbConnect = () => {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGODB);
  }
  return connectionPromise;
};

export default dbConnect;
