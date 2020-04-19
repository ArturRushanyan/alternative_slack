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
    next();
};

exports.Login = (req, res, next) => {
    const schema = Schema.Login;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    next();
};

exports.resetPassword = (req, res, next) => {
  const schema = Schema.resetPassword;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    next();
};

exports.resetPasswordConfirmation = (req, res, next) => {
    const schema = Schema.resetPasswordConfirmation;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
    next();
};

exports.createWorkspace = (req, res, next) => {
    const schema = Schema.createWorkspace;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, constants.VALIDATION_ERROR);
    }
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
    next();
};
