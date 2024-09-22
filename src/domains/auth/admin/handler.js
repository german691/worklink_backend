import { authenticateAdmin, createNewAdmin, getUsersInfo } from "./controller.js";
import authSchema from "./../../../validation/adminSchemes.js";

// login
export const handleAdminLogin = async (req, res) => {
  try {
    const { error, value } = authSchema.validate(req.body);
    if (error) {
      throw Error(error.details[0].message);
    }

    const authenticatedUser = await authenticateAdmin(value);

    res.status(200).json(authenticatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// register
export const handleAdminRegister = async (req, res) => {
  try {
    const key = req.headers["x-admin-key"];
    if (key !== process.env.ADMIN_KEY) {
      throw new Error("Unautorized access.");
    }

    const { error, value } = authSchema.validate(req.body);
    if (error) {
      throw Error(error.details[0].message);
    }
    const newAdmin = await createNewAdmin(value);

    res.status(200).json(newAdmin);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const handleUserInfoGetter = async (req, res) => {
  try {
    const userInfo = await getUsersInfo();
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(400).send(error.message);
  } 
};