const Joi = require('joi');

const adminAuthSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    password: Joi.string().min(8).required(),
});

module.exports = { adminAuthSchema };