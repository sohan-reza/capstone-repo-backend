import mongoose from "mongoose";

const MONGODB_URL=process.env.MONGODB_URL;

async function connection (){
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

export default connection;