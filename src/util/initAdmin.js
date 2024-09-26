import { Admin } from "../domains/auth/admin/model.js";
import { hashData } from "./hashData.js";

export const initAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({});
    if (adminExists) {
      console.log('No need for initializing "Admin" account.');
      return;
    }

    const { DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD } = process.env;
    const username = DEFAULT_ADMIN_USERNAME || 'admin';
    const password = DEFAULT_ADMIN_PASSWORD || 'admin';

    const hashedPassword = await hashData(password);

    const adminObj = {
      username,
      password: hashedPassword,
      userType: "admin"
    };

    await Admin.create(adminObj);

    console.log(`Admin created successfully with credentials username: '${username}' and password: '${password}'`);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};
