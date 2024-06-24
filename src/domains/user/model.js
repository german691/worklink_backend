const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    token: String,
    userType: String,
    verified: { type: Boolean, default: false },
    accessLevel: { type: String, enum: ['user', 'admin'], default: 'user' }
});
 
const User = mongoose.model("User", UserSchema);

module.exports = User;