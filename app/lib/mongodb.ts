import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URL;

export default dbConnect;

let dbConected = false;

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  if (dbConected) {
    return mongoose;
  }
  await mongoose.connect(MONGODB_URI);
  dbConected = true;
  console.log("DB:", mongoose.connection.name);
  console.log("Collection:", mongoose.connection.collections);
  return mongoose;
}
