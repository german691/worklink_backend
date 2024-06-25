const User = require("./model");
const { hashData, verifyHashedData } = require("./../../../util/hashData");
const createToken = require("./../../../util/createToken");

const authenticateUser = async (data) => {
    try {
        const { username, email, password } = data;

        if (!(username || email)) {
            throw new Error('Expected a username or email');
        }
        
        if (username && email) {
            throw new Error('Expected only a username or email, not both');
        }

        let fetchedUser;

        if (username) {
            fetchedUser = await User.findOne({ username });
        } else if (email) {
            fetchedUser = await User.findOne({ email });
        }

        if (!fetchedUser) {
            throw new Error(`Invalid credentials (no user found with ${username ? 'username ' + username : 'email ' + email})`);
        }

        if (!fetchedUser.verified) {
            throw new Error("Email hasn't been verified yet. Check your inbox.");
        }

        const hashedPassword = fetchedUser.password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);

        if (!passwordMatch) {
            throw new Error("Incorrect password");
        }

        const tokenData = { userId: fetchedUser._id, username: fetchedUser.username, email: fetchedUser.email };
        const token = await createToken(tokenData);

        fetchedUser.token = token;

        return fetchedUser;
    } catch (error) {
        throw error;
    }
};

const createNewUser = async (data) => {
    try {
        const { 
            username, 
            email, 
            password, 
            userType,
            name,
            surname,
            birthdate,
        } = data;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw Error("User with the provided email already exists");
        }

        const userTypes = ['worker', 'client'];

        if (!userTypes.includes(userType)) {
            throw Error(`User must be a "worker" or a "client, got ${userType}"`);
        }

        const hashedPassword = await hashData(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            userType,
        });

        const createdUser = await newUser.save();

        return createdUser;
    } catch (error) {
        throw error;
    }
};

module.exports = { createNewUser, authenticateUser };