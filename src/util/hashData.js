import bcrypt from "bcrypt";

const hashData = async (data, saltRounds = 10) => {
  try {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;
  } catch (error) {
    throw error;
  }  
};

const verifyHashedData = async (unhasedPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(unhasedPassword, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
};

export { hashData, verifyHashedData };