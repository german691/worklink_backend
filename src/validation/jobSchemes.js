import Joi from 'joi';

export const jobIdSchema = Joi.string().required();
export const userIdSchema = Joi.string().required();

export const getJobSchema = Joi.object({
  offset: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  username: Joi.string().optional()
});

export const postJobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required()
});

export const dropJobSchema = Joi.object({
  jobId: jobIdSchema
});

export const editJobSchema = Joi.object({
  jobId: jobIdSchema,
  title: Joi.string().optional(),
  description: Joi.string().optional(),
});

export const findJobSchema = Joi.object({
  jobId: jobIdSchema
});

export const startJobSchema = Joi.object({
  userId: userIdSchema,
  jobId: jobIdSchema
});

export const finishJobSchema = Joi.object({
  jobId: jobIdSchema
});

export const applyToWorkSchema = Joi.object({
  jobId: jobIdSchema
});

export const leaveJobSchema = Joi.object({
  jobId: jobIdSchema
});

export const categorySetterSchema = Joi.object({
  category: Joi.alternatives().try(
    Joi.string().required(),
    Joi.array().items(Joi.string().required())
  ).required()
});
