const { Admin } = require("./model");
const { User } = require("./../user/model");
const { hashData, verifyHashedData } = require("./../../../util/hashData");
const createToken = require("./../../../util/createToken");
const { _encrypt } = require("../../../util/cryptData");

const authenticateAdmin = async (value) => {
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

const createNewAdmin = async (value) => {
    try {
        const { username, password } = value;

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

// controles para testing
const getUsersInfo = async () => {
    try {
        const users = await User.find();
        const userInfo = users.map(user => {
            const { _id, ...rest } = user._doc;
            return {
                userId: _encrypt(user._id.toString()),
                ...rest
            };
        });

        return userInfo;
    } catch (error) {
        throw error;
    }
};

module.exports = { authenticateAdmin, createNewAdmin, getUsersInfo };