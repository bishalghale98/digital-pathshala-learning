import mongoose from "mongoose";

const MONGODB = process.env.MONGODB;

if (!MONGODB) {
  throw new Error("Mongo Db string should must provide");
}

const dbConnect = () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Database is already connected 😘😘😘😘");
    return;
  }
  try {
    mongoose.connect(MONGODB);
    console.log("Database is connected successfully ❤️❤️");
  } catch (error) {
    console.error("Database connection error 😢😢😢", error);
  }
};

export default dbConnect;
