import mongoose from 'mongoose';
import moment from 'moment';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["worker", "client"], required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  birthdate: { type: Date, required: true },
  verified: { type: Boolean, default: false },
  token: String,
  isActive: { type: Boolean, default: true },
});

UserSchema.methods.getFormattedBirthdate = function() {
  return moment(this.birthdate).format('DD-MM-YYYY');
};

const User = mongoose.model("User", UserSchema);

export default User;
