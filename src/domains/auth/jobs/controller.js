const mongoose = require('mongoose');
const { Job, JobCategory } = require('./model');
const { User } = require('./../user/model');
const { ObjectId } = require('mongodb');
const { _encrypt, _decrypt } = require("./../../../util/cryptData");

// POST methods
const sendNewJob = async (data) => {
    try {
        const { publisher, userId, title, description, category } = data; // imageURLs

        const fetchedCategories = await JobCategory.findOne({ category })
        if (!fetchedCategories) throw Error (`${category} doesn't seem to be listed in 'categories'`)

        const fetchedUser = await User.findOne({ _id: userId });
        if (!fetchedUser) throw Error("token appears not to reference a valid user");

        const newJob = new Job({
            userId, title, description, publisher, category,
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

// GET methods para FRONT
const getJobs = async (data) => {
    try {
        const { page = 1, limit = 10, username } = data;
        const skip = (page - 1) * limit;

        let user = null;
        if (username) {
            user = await User.findOne({ username });
            if (user === null) {
                return { status: 404, message: "Username not found" };
            }
        }

        const query = user ? { userId: user._id } : {};
        const totalJobs = await Job.countDocuments(query);
        const jobs = await Job.find(query).skip(skip).limit(limit);

        if (jobs.length === 0) return { status: 404, message: "No jobs found" };

        const encryptedJobIds = jobs.map(job => ({ 
            id: _encrypt(job._id.toString()), // encripto las IDs de los trabajos antes de enviarlos al front
            title: job.title, 
            description: job.description, 
            publisher: job.publisher 
        }));

        const totalPages = limit > 0 ? Math.ceil(totalJobs / limit) : 0;

        return { jobs: encryptedJobIds, totalJobs, totalPages };
    } catch (error) {
        throw error;
    }
};

// DELETE methods
const dropJob = async (data) => {
    try {
        const { userId, jobId } = data;

        if (!(userId && jobId)) {
            throw Error("userId and jobId required");
        }

        const fetchedJob = await Job.findOne({ _id: _decrypt(jobId) });
        if (!fetchedJob) throw Error("Job not found");

        const fetchedUser = await User.findOne({ _id: userId });
        if (!fetchedUser) throw Error("Job or user not found");

        if (!new ObjectId(fetchedJob.userId).equals(fetchedUser._id)) {
            throw Error("Unautorized access");
        }
        
        const dropedResult = await Job.deleteOne({ _id: fetchedJob._id });
        return dropedResult;
    } catch (error) {
        throw error;
    }
}

// PUT methods
const editJob = async (data) => {
    try {
        const { userId, jobId, title, description } = data; 

        if (!(userId && jobId)) {
            throw Error("userId and jobId required");
        }

        const id = _decrypt(jobId)

        const fetchedJob = await Job.findOne({ _id: id });

        if (!new ObjectId(fetchedJob.userId).equals(userId)) {
            throw Error("Unautorized access");
        }

        const editedJob = await Job.updateOne(
            { _id: id }, // filter
            { $set: { title, description } }); // set

        return editedJob;

    } catch (error) {
        throw error;
    }
}

// worker
const updateFinalApplicant = async (jobId, userId) => {
    try {

    } catch (error) {
        throw error;
    }
};

// admin 
const createNewCategory = async (data) => {
    try {
        const { category } = data;
    
        const newCategory = new JobCategory({ category });
    
        const createdCategory = await newCategory.save();
    
        return createdCategory;
        
    } catch (error) {
        throw error;
    }
}

const getCategories = async () => {
    try {    
        const categories = JobCategory.find();
        return categories;      
    } catch (error) {
        throw error;
    }
}


module.exports = { sendNewJob, getJobs, updateFinalApplicant, dropJob, editJob, getCategories, createNewCategory };
