const User = require("./model");
const { hashData, verifyHashedData } = require("./../../util/hashData");
const createToken = require("./../../util/createToken");

const autenticateUser = async (data) => {
    try {
        const { email, password } = data;
        const fetchedUser = await User.findOne({ email });

        if (!fetchedUser) {
            throw Error(`Invalid credentials (no user found with email ${email})`);
        }

        if (!fetchedUser.verified) {
            throw Error(`Email hasn't been verified yet. Check your inbox.`);
        }

        const hashedPassword = fetchedUser.password;

        const passwordMatch = await verifyHashedData(password, hashedPassword);
        if (!passwordMatch) {
            throw Error("Incorrect password")
        }

        //Acá porfinnn creamos el token para el usuario
        //Primero obtenemos el id del usuario y el email como parametros para pasarle al creador de tokens
        const tokenData = { userId: fetchedUser._id, email };
        //De ahi creamos el token, y lo asociamos al usuario que fue encontrado
        const token = await createToken(tokenData);
        fetchedUser.token = token;
        return fetchedUser;
    } catch (error) {
        throw error;
    }
}

const createNewUser = async (data) => {
    try {
        const { name, email, password } = data;

        //vemos si el usuario ya existe
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw Error("User with the provided email already exists");
        }

        //si el usuario no existe, tonces hasheamos el pwd para guardarlo en mongo
        const hashedPassword = await hashData(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        //guardamos el usuario
        const createdUser = await newUser.save();

        return createdUser;
    } catch (error) {
        throw error;
    }
};

module.exports = { createNewUser, autenticateUser };