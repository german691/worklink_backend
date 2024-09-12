import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ["worker", "client", "helper"], required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    birthdate: { type: Date, required: true }, 
    verified: { type: Boolean, default: false },
    token: String,
    address: String,
    phone: String,
    info: String,
    active: { type: Boolean, default: true },
    // Future fields:
    // profileImg: String // Reference to the image location
});

const User = mongoose.model("User", UserSchema);

export default User;