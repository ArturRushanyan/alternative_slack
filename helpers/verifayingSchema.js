import Joi from '@hapi/joi';

module.exports = {
    SignUp: Joi.object().keys({
        email: Joi.string().email().required().min(3).max(20),
        password: Joi.string().min(6).max(12),
        fullName: Joi.string().min(5).max(50),
        imageURL: Joi.string()
    }),
};
