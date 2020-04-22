import Joi from '@hapi/joi';

module.exports = {
    SignUp: Joi.object().keys({
        email: Joi.string().email().required().min(5).max(40).trim(),
        password: Joi.string().required().min(6).max(20).trim(),
        confirmPassword: Joi.ref('password'),
        fullName: Joi.string().required().min(3).max(50).trim(),
    }),

    Login: Joi.object().keys({
        email: Joi.string().email().required().min(5).max(40).trim(),
        password: Joi.string().required().min(6).max(20).trim(),
    }),

    resetPassword: Joi.object().keys({
        email: Joi.string().email().required().min(5).max(40).trim(),
    }),

    resetPasswordConfirmation: Joi.object().keys({
        password: Joi.string().required().min(6).max(20).trim(),
    }),

    createWorkspace: Joi.object().keys({
        name: Joi.string().required().min(3).trim(),
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
        email: Joi.string().email().required().min(5).max(40).trim(),
        role: Joi.string().min(5).max(6).trim(),
    }),

    createChannel: Joi.object().keys({
        workspaceId: Joi.string().required(),
        name: Joi.string().required().min(3).trim(),
    }),

    getChannel: Joi.object().keys({
        channelId: Joi.string().required(),
    }),

    updateChannel: Joi.object().keys({
        channelId: Joi.string().required(),
        name: Joi.string().required().min(3).trim(),
    }),

    deleteChannel: Joi.object().keys({
        channelId: Joi.string().required(),
        workspaceId: Joi.string().required(),
    }),
};

