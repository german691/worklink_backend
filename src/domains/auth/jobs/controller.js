const mongoose = require('mongoose');
const Job = require('./model');
const User = require('./../user/model');
const { ObjectId } = require('mongodb');

// GET methods para FRONT
const getJobs = async (data) => {
    try {
        const { page = 1, limit = 10, username } = data;
        const skip = (page - 1) * limit;

        let user;
        if (username) {
            user = await User.findOne({ username });
            if (!user) {
                return { status: 404, message: "Username not found" };
            }
        }

        const query = user ? { userId: user._id } : {};
        const totalJobs = await Job.countDocuments(query);
        const jobs = await Job.find(query).skip(skip).limit(limit);

        const totalPages = limit > 0 ? Math.ceil(totalJobs / limit) : 0;

        return { jobs, totalJobs, totalPages };
    } catch (error) {
        throw error;
    }
};

// POST methods
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

// Hay que mejorar la lógica de edición y eliminación
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

        if (fetchedUser.userType !== "client") {
            throw Error(`Only "client" type user can drop job requests, not ${userType}`);
        }

        if (!new ObjectId(fetchedJob.userId).equals(fetchedUser._id)) {
            throw Error("Unautorized access");
        }
        
        const dropedResult = await Job.deleteOne({ _id: jobId });
        return dropedResult;
    } catch (error) {
        throw error;
    }
}

const editJob = async (data) => {
    try {
        const { userId, jobId, title, body } = data; 

        if (!(userId && jobId)) {
            throw Error("userId and jobId required");
        }

        const fetchedJob = await Job.findOne({ _id: jobId });
        const fetchedUser = await User.findOne({ _id: userId });

        if (fetchedUser.userType !== "client") {
            throw Error(`Only "client" type user can drop job requests, not ${userType}`);
        }

        if (!new ObjectId(fetchedJob.userId).equals(fetchedUser._id)) {
            throw Error("Unautorized access");
        }

        if (!title) {
            title = fetchedJob.title;
        }

        if (!body) {
            body = fetchedJob.body;
        }

        const filter = { _id: jobId };
        const updatePost = { $set: { title: title, body: body } };

        const editedJob = await Job.updateOne(filter, updatePost);
        return editedJob;
    } catch (error) {
        throw Error("Unautorized access");
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

module.exports = { sendNewJob, getJobs, updateFinalApplicant, dropJob, editJob };
