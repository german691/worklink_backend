const { authenticateAdmin, createNewAdmin, getUsersInfo } = require("./controller");
const { authSchema } = require("./../../../validation/adminSchemes");

const handleAdminLogin = async (req, res) => {
    try {
        const { error, value } = authSchema.validate(req.body);
        if (error) {
            throw Error(error.details[0].message);
        }

        const authenticatedUser = await authenticateAdmin({ value });

        res.status(200).json(authenticatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const handleAdminRegister = async (req, res) => {
    try {
        const key = req.headers["x-admin-key"];
        if (key !== process.env.ADMIN_KEY) {
            throw new Error("Unautorized access.");
        }

        const { error, value } = authSchema.validate(req.body);
        if (error) {
            throw Error(error.details[0].message);
        }

        //esto debe estar en un middleware
        const newAdmin = await createNewAdmin({ value });

        res.status(200).json(newAdmin);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const handleUserInfoGetter = async (req, res) => {
    try {
        const userInfo = await getUsersInfo();
        res.status(200).json(userInfo);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = { handleAdminRegister, handleAdminLogin, handleUserInfoGetter };