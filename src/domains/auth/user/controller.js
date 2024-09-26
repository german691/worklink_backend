import User from "./model.js";
import { hashData, verifyHashedData } from "./../../../util/hashData.js";
import createToken from "./../../../util/createToken.js";

const handleError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

const checkUserExists = async (username, email) => {
  const [existingEmail, existingUsername] = await Promise.all([
    User.findOne({ email }),
    User.findOne({ username })
  ]);

  if (existingEmail) handleError("User with the provided email already exists", 409);
  if (existingUsername) handleError("User with the provided username already exists", 409);
};

const createNewUser = async (value) => {
  const { username, email, password, userType, name, surname, birthdate } = value;

  await checkUserExists(username, email);
  const hashedPassword = await hashData(password);
  const [capitalizedName, capitalizedSurname] = capitalize({ data: [name, surname] });

  const newUser = new User({
    username, 
    email, 
    password: hashedPassword, 
    userType,
    name: capitalizedName,
    surname: capitalizedSurname, 
    birthdate
  });

  return await newUser.save();
};

const authenticateUser = async (value) => {
  const { username, email, password } = value;
  const userIdentifier = username || email;

  const fetchedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (!fetchedUser) handleError(`${userIdentifier} not found`, 404);

  if (!fetchedUser.verified) {
    handleError("Email hasn't been verified yet. Please check your inbox, or request a new code", 403);
  }

  if (!fetchedUser.isActive) {
    handleError("The user is deactivated. Contact administrator", 403);
  }

  const passwordMatch = await verifyHashedData(password, fetchedUser.password);
  if (!passwordMatch) handleError("Incorrect password", 401);

  const tokenData = { userId: fetchedUser._id, username: fetchedUser.username, userType: fetchedUser.userType };
  const token = await createToken(tokenData);
  return { token, role: fetchedUser.userType };
};

const capitalize = ({ data }) => {
  return data.map(value =>
    value.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase())
  );
};

export { createNewUser, authenticateUser };
