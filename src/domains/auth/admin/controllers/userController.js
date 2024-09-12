import User from "../../user/model.js";

export const getUsersInfo = async () => {
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
