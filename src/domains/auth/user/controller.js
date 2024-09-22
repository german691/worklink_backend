import User from "./model.js";
import { hashData, verifyHashedData } from "./../../../util/hashData.js";
import createToken from "./../../../util/createToken.js";

const createNewUser = async (value) => {
  const { username, email, password, userType, name, surname, birthdate } = value;

  const existingEmail = await User.findOne({ email });
  const existingUsername = await User.findOne({ username });

  if (existingEmail) throw new Error("User with the provided email already exists");
  if (existingUsername) throw new Error("User with the provided username already exists");

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

  return newUser.save();
};

const authenticateUser = async (value) => {
  const { username, email, password } = value;
  const userIdentifier = username || email;

  const fetchedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (!fetchedUser) {
    throw new Error(`${userIdentifier} not found`);
  }

  if (!fetchedUser.verified) {
    throw new Error("Email hasn't been verified yet. Check your inbox.");
  }

  const passwordMatch = await verifyHashedData(password, fetchedUser.password);

  if (!passwordMatch) {
    throw new Error("Incorrect password");
  }

  const tokenData = { userId: fetchedUser._id, username: fetchedUser.username, userType: fetchedUser.userType };
  return createToken(tokenData);
};

const capitalize = ({ data }) => {
  return data.map(value =>
    value.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase())
  );
};

export { createNewUser, authenticateUser };
