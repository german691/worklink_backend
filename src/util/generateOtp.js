const generateOtp = async () => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
        return otp; 
    } catch (error) {
        throw error;
    }
};

export default { generateOtp };