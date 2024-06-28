const User = require("./model");
const { hashData, verifyHashedData } = require("./../../../util/hashData");
const createToken = require("./../../../util/createToken");

const authenticateUser = async (data) => {
    const { username, email, password } = data

    try {
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

        // en vez de poner el usertype en el token, debo hacer un User.findOne({ _id: userId }); y obtengo todos los datos del usuario
        const tokenData = { userId: fetchedUser._id, username: fetchedUser.username, userType: fetchedUser.userType };
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
            dni,
            birthdate,
        } = data;

        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingEmail) throw Error("User with the provided email already exists");
        if (existingUsername) throw Error("User with the provided username already exists");

        const newDate = await checkIfUnderage(birthdate);

        const hashedPassword = await hashData(password);

        capitalizeName = name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        capitalizeSurname = surname.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

        const newUser = new User({
            username, 
            email, 
            password: hashedPassword, 
            userType,
            name: capitalizeName,
            surname: capitalizeSurname, 
            dni,
            birthdate: newDate,
        });

        const createdUser = await newUser.save();

        return createdUser;
    } catch (error) {
        throw error;
    }
};

const checkIfUnderage = async (birthdate) => {
    try {
        const birthdateObject = new Date(birthdate);

        if (isNaN(birthdateObject.getTime())) {
            throw new Error("Invalid birthdate value");
        }

        const currentDate = new Date();
        
        let age = currentDate.getFullYear() - birthdateObject.getFullYear();
        const monthDifference = currentDate.getMonth() - birthdateObject.getMonth();
        const dayDifference = currentDate.getDate() - birthdateObject.getDate();

        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }

        if (age < 21) {
            throw new Error("User must be at least 21 years old");
        }

        return birthdateObject;
    } catch (error) {
        throw error;
    }
}

module.exports = { createNewUser, authenticateUser, checkIfUnderage };