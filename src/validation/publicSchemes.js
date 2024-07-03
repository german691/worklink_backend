const Joi = require('joi');

const resetPwdSchema = Joi.object({
    otp: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

module.exports = { resetPwdSchema };