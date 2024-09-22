import Joi from 'joi';

const authSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().min(8).required(),
});

export default authSchema;