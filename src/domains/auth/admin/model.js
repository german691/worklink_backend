import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserType = {
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};

const AdminSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, enum: Object.values(UserType), required: true, default: UserType.ADMIN },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

export { AdminSchema, Admin, UserType };
