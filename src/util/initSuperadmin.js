import { Admin } from "../domains/auth/admin/model.js";
import { hashData } from "./hashData.js";

export const initSuperadmin = async () => {
  try {
    const superadminExists = await Admin.findOne({ userType: "superadmin" });
    if (superadminExists) {
      console.log('No need for initializing "Superadmin" account.');
      return;
    }

    const { DEFAULT_SUPERADMIN_USERNAME, DEFAULT_SUPERADMIN_PASSWORD } = process.env;
    const username = DEFAULT_SUPERADMIN_USERNAME || 'superadmin';
    const password = DEFAULT_SUPERADMIN_PASSWORD || 'superadmin';

    const hashedPassword = await hashData(password);

    const superadminObj = {
      username,
      password: hashedPassword,
      userType: "superadmin"
    };

    await Admin.create(superadminObj);

    console.log(`Superadmin created successfully with credentials username: '${username}' and password: '${password}'`);
  } catch (error) {
    console.error('Error creating superadmin:', error);
  }
};
