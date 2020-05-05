import Schema from '../helpers/verifayingSchema';
import Error from '../helpers/Error';
import * as constants from '../helpers/constants';

exports.Registration = (req, res, next) => {
    const schema = Schema.SignUp;
    if (req.body.password !== req.body.confirmPassword) {
        return false;
    }
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    req.body.email = result.value.email;
    req.body.password = result.value.password;
    req.body.fullName = result.value.fullName;
    next();
};

exports.Login = (req, res, next) => {
    const schema = Schema.Login;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }

    req.body.email = result.value.email;
    req.body.password = result.value.password;
    next();
};

exports.resetPassword = (req, res, next) => {
  const schema = Schema.resetPassword;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    req.body.password = result.value.password;
    next();
};

exports.resetPasswordConfirmation = (req, res, next) => {
    const schema = Schema.resetPasswordConfirmation;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    req.body.password = result.value.password;
    next();
};

exports.createWorkspace = (req, res, next) => {
    const schema = Schema.createWorkspace;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    req.body.name = result.value.name;
    next();
};

exports.getWorkspace = (req, res, next) => {
    const schema = Schema.getWorkspace;
    const result = schema.validate(req.params);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    next();
};

exports.updateWorkspace = (req, res, next) => {
    const reqData = {
        workspaceId: req.params.workspaceId,
        name: req.body.name
    };
    const schema = Schema.updateWorkspace;
    const result = schema.validate(reqData);

    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    req.body.name = result.value.name;
    next();
};

exports.deleteWorkspace = (req, res, next) => {
    const schema = Schema.deleteWorkspace;
    const result = schema.validate(req.params);

    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    next();
};

exports.addUserToWorkspace = (req, res, next) => {
    const data = {
      workspaceId: req.params.workspaceId,
      email: req.body.email,
    };
    const schema = Schema.addUserToWorkspace;
    const result = schema.validate(data);

    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    req.body.email = result.value.email;
    req.body.role =  result.value.role;
    next();
};

exports.createChannel = (req, res, next) => {
    const data = {
      name: req.body.name,
      workspaceId: req.body.workspaceId || req.params.workspaceId
    };

    const schema = Schema.createChannel;
    const result = schema.validate(data);

    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    req.body.name = result.value.name;
    next();
};

exports.getChannel = (req, res, next) => {
    const schema = Schema.getChannel;
    const result = schema.validate(req.params);

    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    next();
};

exports.updateChannel = (req, res, next) => {
    const data = {
      name: req.body.name,
      channelId: req.params.channelId
    };
    const schema = Schema.updateChannel;
    const result = schema.validate(data);

    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    req.body.name = result.value.name;
    next();
};

exports.deleteChannel = (req, res, next) => {
    const data = {
        channelId: req.params.channelId,
        workspaceId: req.body.workspaceId
    };

    const schema = Schema.deleteChannel;
    const result = schema.validate(data);

    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    next();
};

exports.updateUser = (req, res, next) => {
    const schema = Schema.updateUser;
    const result = schema.validate(req.body);

    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }

    req.body.fullName = result.value.fullName;
    req.body.email = result.value.email;

    next();
};

exports.updateImage = (req, res, next) => {
    const schema = Schema.updateImage;
    const result = schema.validate(req.query);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    next();
};

exports.updateUserRole = (req, res, next) => {
    const schema = Schema.updateUserRole;
    const data = {
        role: req.body.role,
        workspaceId: req.params.workspaceId,
        userId: req.body.userId,
    };
    const result = schema.validate(data);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    req.body.role = result.value.role;

    next();
};

exports.removeUserFromWorkspace = (req, res, next) => {
    const schema = Schema.removeUserFromWorkspace;
    const data = {
        workspaceId: req.params.workspaceId,
        userId: req.body.userId,
    };

    const result = schema.validate(data);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }

    next();
};


