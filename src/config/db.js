
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
//uri
const MONGODB_URI = process.env.MONGODB_URI;

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB WorkLink cluster")
  } catch (error) {
    console.log(error);
  }
}

export default connectToDB;