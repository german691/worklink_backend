import Joi from 'joi';

const resetPwdSchema = Joi.object({
  otp: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export default resetPwdSchema;