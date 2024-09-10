import Joi from 'joi';

const signupSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    userType: Joi.string().valid('client', 'worker').required(),
    name: Joi.string().required(),
    surname: Joi.string().required(),
    birthdate: Joi.date().required(),
});

const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(8).required(),
}).xor('username', 'email');

export { loginSchema, signupSchema };