import { getUsersInfo } from "../controllers/userController.js";

export const handleUserInfoGetter = async (req, res) => {
    try {
        const userInfo = await getUsersInfo();
        res.status(200).json(userInfo);
    } catch (error) {
        res.status(400).send(error.message);
    }
};
