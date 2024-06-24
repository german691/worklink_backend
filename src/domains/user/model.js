const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    token: String,
    userType: String,
    verified: { type: Boolean, default: false },
    accessLevel: { type: String, enum: ['user', 'admin'], default: 'user' }

    // faltan datos propios del usuario 
    // dni: String,
    // adress: String,
    // jobs: [String]
});
 
const User = mongoose.model("User", UserSchema);

module.exports = User;