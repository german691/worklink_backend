import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, default: "admin" },
  token: String,
});

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;