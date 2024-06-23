
const mongoose = require("mongoose");

//uri
const { MONGODB_URI } = process.env;

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

connectToDB();