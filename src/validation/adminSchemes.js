import Joi from 'joi';

const authSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().min(4).required(),
});

export default authSchema;