import mongoose from "mongoose";

const MONGODB = process.env.MONGODB;

if (!MONGODB) {
  throw new Error("Mongo Db string should must provide");
}

const dbConnect = () => {
  try {
    mongoose.connect(MONGODB);
    console.log("Database is connected successfully ❤️❤️");
  } catch (error) {
    console.error("Database connection error 😢😢😢", error);
  }
};

export default dbConnect;
