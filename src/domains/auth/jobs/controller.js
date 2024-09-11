import mongoose from 'mongoose';
import { Job, JobCategory } from './model.js';
import User from './../user/model.js';
import ObjectId from 'mongodb';
import { _encrypt, _decrypt } from "./../../../util/cryptData.js";

// client --------------------------------------------------------------
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

const dropJob = async (data) => {
    try {
        const { userId, jobId } = data;

        if (!(userId && jobId)) {
            throw Error("userId and jobId required");
        }

        const fetchedJob = await Job.findOne({ _id: _decrypt(jobId) });
        if (!fetchedJob) throw Error("Job not found");

        if (fetchedJob.finished === true) {
            throw Error("You cannot drop a job that has already been flagged as finished");
        }

        // debe avisar al trabajador aplicado al trabajo que su publicación fue marcada como sin listar
        if (fetchedJob.finalApplicant) {
            throw Error("You cannot drop a job that has a deffinitive applicant");
        }

        const fetchedUser = await User.findOne({ _id: userId });
        if (!fetchedUser) throw Error("Job or user not found");

        if (!new ObjectId(fetchedJob.userId).equals(fetchedUser._id)) {
            throw Error("Unautorized access");
        }
        
        const dropedResult = await Job.findOneAndUpdate(
            { _id: jobId }, 
            { $set: { unlisted: true, unlistedAt: new Date() }}, 
            { new: true }
        );

        return dropedResult;
        
    } catch (error) {
        throw error;
    }
}

const editJob = async (data) => {
    try {
        const { userId, jobId, title, description } = data; 

        if (!(userId && jobId)) {
            throw Error("userId and jobId required");
        }

        const id = _decrypt(jobId);

        const fetchedJob = await Job.findOne({ _id: id });
        if (!fetchedJob) throw Error("Job not found");

        if (!new ObjectId(fetchedJob.userId).equals(userId)) {
            throw Error("Unautorized access");
        }

        if (fetchedJob.finished === true) {
            throw Error("You cannot edit a job that has already been flagged as finished");
        }

        if (fetchedJob.finalApplicant || fetchedJob.applicantsId.length > 0) {
            throw Error("You cannot edit a job where workers applied");
        }

        const editedJob = await Job.updateOne(
            { _id: id }, // filter
            { $set: { title, description } // set
        }); 

        return editedJob;

    } catch (error) {
        throw error;
    }
}

const setFinalWorker = async (data) => {
    try {
        const { userId, jobId, currentUserId } = data; 

        const fetchedWorker = await User.findOne({ _id: _decrypt(userId) });
        if (!fetchedWorker) {
            throw Error("User not found");
        }
    
        // si se trata de aplicar al trabajo cualquier usuario que no sea un trabajador
        if (fetchedWorker.userType !== "worker") {
            throw Error(`userType must be worker, got ${fetchedWorker.userType}`);
        }

        const _jobId = _decrypt(jobId);
        const fetchedJob = await Job.findOne({ _id: _jobId });
        if (!fetchedJob) {
            throw Error("Job not found");
        }

        if (fetchedJob.finished) {
            throw Error("You cannot start a job that already finished");
        }

        if (!new ObjectId(fetchedJob.userId).equals(currentUserId)) {
            throw Error("This job post does not belong to the given user");
        }
        
        const im_frustrated = await Job.find();

        const _userId = new ObjectId(_decrypt(userId));
        console.log(_userId)
        console.log(im_frustrated)

        const userInApplicants = await Job.findOne({
            _id: _jobId,
            applicantsId: { $in: [ _userId ] }
        });

        if (!userInApplicants) {
            throw Error("The worker needs to be in the applicants list in order to be selected");
        }

        const finalWorker = await Job.updateOne(
            { _id: _jobId }, // filter
            { $set: { 
                applicantsId: [null],
                finalApplicant: _userId
            } }
        );

        return finalWorker;

    } catch (error) {
        throw error;
    }
};

const markJobAsCompleted = async (data) => {
    try {
        const { currentUserId, jobId } = data; 
        
        if (!jobId) {
            throw Error("jobId required");
        }

        const _jobId = _decrypt(jobId);

        const fetchedJob = await Job.findOne({ _id: _jobId });
        if (!fetchedJob) {
            throw Error("Job not found");
        }

        if (!fetchedJob.finalApplicant) {
            throw Error("Job does not contain a final applicant");
        }

        if (!new ObjectId(fetchedJob.userId).equals(currentUserId)) {
            throw Error("This job post does not belong to the given user");
        }

        const completedJob = await Job.updateOne(
            { _id: _jobId }, // filter
            { $set: { finished: true } } // set
        );

        return completedJob;
    } catch (error) {
        throw error;
    }
};

// worker --------------------------------------------------------------
const applyToJob = async (data) => {
    try {
        const { userId, jobId } = data; 

        if (!(userId && jobId)) {
            throw Error("userId and jobId required");
        }

        const id = _decrypt(jobId)

        const fetchedJob = await Job.findOne({ _id: id });
        if (fetchedJob.finalApplicant) {
            throw Error("You cannot apply to a job that has already started");
        }

        const applicants = fetchedJob.applicantsId;

        if (applicants.includes(userId)) {
            throw Error("Already in applicants list");
        }

        applicants.push(userId);

        const editedJob = await Job.updateOne(
            { _id: id }, // filter
            { $set: { applicantsId: applicants } } // set
        );

        return editedJob;

    } catch (error) {
        throw error;
    }
};

const leaveJob = async (data) => {
    try {
        const { userId, jobId } = data; 

        if (!(userId && jobId)) {
            throw Error("userId and jobId required");
        }

        const id = _decrypt(jobId)

        const fetchedJob = await Job.findOne({ _id: id });
        const finalApplicant = fetchedJob.finalApplicant ? fetchedJob.finalApplicant.toString() : null;
        
        // si hay un aplicante final y ese aplicante final es a su vez el usuario actual
        // la lógica actual es de negación, pero a futuro si se va a poder dejar el trabajo
        // no está definido qué acción se va a tomar todavía, por lo que así se queda.
        if (finalApplicant && finalApplicant === userId.toString()) {
            throw Error("You cannot leave a job you already been accepted");
        }

        const applicants = fetchedJob.applicantsId;

        if (!applicants.includes(userId.toString())) {
            throw Error("User is not listed as an applicant");
        }

        let updatedApplicants = applicants.filter(_userId => _userId.toString() !== userId.toString());

        const leftJob = await Job.updateOne(
            { _id: id }, // filter
            { $set: { applicantsId: updatedApplicants } } // set
        );

        return leftJob;

    } catch (error) {
        throw error;
    }
};

// admin --------------------------------------------------------------
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


export { sendNewJob, getJobs, dropJob, editJob, getCategories, 
                 createNewCategory, applyToJob, leaveJob, setFinalWorker,
                 markJobAsCompleted };
