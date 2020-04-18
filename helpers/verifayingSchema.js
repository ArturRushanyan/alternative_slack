import Joi from '@hapi/joi';

module.exports = {
    SignUp: Joi.object().keys({
        email: Joi.string().email().required().min(5).max(40),
        password: Joi.string().required().min(6).max(20),
        confirmPassword: Joi.ref('password'),
        fullName: Joi.string().required().min(3).max(50),
    }),

    Login: Joi.object().keys({
        email: Joi.string().email().required().min(5).max(40),
        password: Joi.string().required().min(6).max(20),
    }),

    resetPassword: Joi.object().keys({
        email: Joi.string().email().required().min(5).max(40),
    }),

    resetPasswordConfirmation: Joi.object().keys({
        password: Joi.string().required().min(6).max(20),
    }),

    createWorkspace: Joi.object().keys({
        name: Joi.string().required().min(3),
    }),

    getWorkspace: Joi.object().keys({
        workspaceId: Joi.string().required()
    }),

    updateWorkspace: Joi.object().keys({
        workspaceId: Joi.string().required(),
        name: Joi.string().required().min(3),
    }),

    deleteWorkspace: Joi.object().keys({
        workspaceId: Joi.string().required(),
    }),

    addUserToWorkspace: Joi.object().keys({
        workspaceId: Joi.string().required(),
        email: Joi.string().email().required().min(5).max(40),
        role: Joi.string().min(5).max(6),
    }),
};

