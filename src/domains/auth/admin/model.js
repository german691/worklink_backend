import mongoose from 'mongoose';

const { Schema } = mongoose;

const AdminSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, default: "admin" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

export { AdminSchema, Admin };
