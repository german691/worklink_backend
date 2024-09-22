const Joi = require('joi');

export const categorySetterSchema = Joi.object({
  categories: Joi.alternatives().try(
    Joi.array().items(Joi.string().min(1).trim()).min(1),
    Joi.string().min(1).trim()
  )
});

export const validateCategories = (data) => {
  const { error, value } = categorySetterSchema.validate(data);
  if (error) {
    throw new Error(error.message);
  }
  return value;
};
