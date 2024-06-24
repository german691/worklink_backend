const Job = require('./model');
const User = require('./../user/model');

const sendNewJob = async (data) => {
    try {
        const { userId, title, body } = data; // imageURLs

        const fetchedUser = await User.findOne({ _id: userId });

        if (!fetchedUser) {
            throw Error("Token is valid, but user a user with that data wasn't found");
        }

        const newJob = await new Job({
            userId,
            title,
            body,
            createdAt: Date.now(),
            expiresAt: Date.now() + 2592000000, //30 * 24 * 60 * 60 * 1000 = 2592000000 un mes en milisegundos
            //images: [String] contiene urls que referencian a las imagenes 
        });

        const createdJob = await newJob.save();
        return createdJob;
    } catch (error) {
        throw error;
    }
}

const dropJob = async (data) => {
    try {
        const { userId, jobId } = data;

        if (!(userId && jobId)) {
            throw Error("userId and jobId required");
        }

        const fetchedJob = await Job.findOne({ _id: jobId });
        const fetchedUser = await User.findOne({ _id: userId });
    
        if (!(fetchedJob && fetchedUser)) {
            throw Error("Job or user not found");
        }

        if (fetchedJob._id !== fetchedUser._id) {
            throw Error("Unautorized access");
        }
        
        const dropResult = Job.dropOne({ _id: jobId });
        return dropResult;
    } catch (error) {
        throw error;
    }
}

const getUserRelatedJobs = async (data, limit = 8) => {
    try {
        const { userId } = data;
        const userJobs = await Job.find({ userId });
        return userJobs;
    } catch (error) {
        throw error;
    }
}

const getAllJobs = async (limit = 8) => {
    try {
        const allJobs = await Job.find();
        return allJobs;
    } catch (error) {
        throw error;
    }
}

const updateFinalApplicant = async (jobId, userId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid jobId or userId");
        }

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { finalApplicant: userId },
            { new: true }
        );

        if (!updatedJob) {
            throw new Error("Job not found");
        }

        return updatedJob;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

module.exports = { sendNewJob, getUserRelatedJobs, getAllJobs, updateFinalApplicant, dropJob };
