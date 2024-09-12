import { hashData, verifyHashedData } from "./../../../../util/hashData.js";
import createToken from "./../../../../util/createToken.js";
import { _encrypt } from "../../../../util/cryptData.js";
import Admin from "../model.js";

export const authenticateAdmin = async (value) => {
    try {
        const { username, password } = value;
        const fetchedAdmin = await Admin.findOne({ username });

        if (!fetchedAdmin) {
            throw new Error(`Invalid username`);
        }

        const hashedPassword = fetchedAdmin.password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);

        if (!passwordMatch) {
            throw new Error("Incorrect password");
        }

        const tokenData = { userId: fetchedAdmin._id, username: fetchedAdmin.username, userType: fetchedAdmin.userType };
        const token = await createToken(tokenData);

        fetchedAdmin.token = token;
        return token;

    } catch (error) {
        throw error;
    }
};

export const createNewAdmin = async (value) => {
    try {
        const { username, password } = value;

        if (!(username && password)) {
            throw new Error('Username and Password needed')
        }

        const usernameExists = await Admin.findOne({ username });
        if (usernameExists) throw Error("Username is not available");

        const hashedPassword = await hashData(password);

        const newAdmin = new Admin({
            username, 
            password: hashedPassword,
        });

        const createdAdmin = await newAdmin.save();

        return createdAdmin;

    } catch (error) {
        throw error;
    }
}