import Schema from '../helpers/verifayingSchema';
import Error from '../helpers/Error';

exports.Registration = (req, res, next) => {
    const schema = Schema.SignUp;
    if (req.body.password !== req.body.confirmPassword) {
        return false;
    }
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
    }
    next();
};

exports.Login = (req, res, next) => {
    const schema = Schema.Login;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
    }
    next();
};

exports.resetPassword = (req, res, next) => {
  const schema = Schema.resetPassword;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
    }
    next();
};

exports.resetPasswordConfirmation = (req, res, next) => {
    const schema = Schema.resetPasswordConfirmation;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
    }
    next();
};

exports.createWorkspace = (req, res, next) => {
    const schema = Schema.createWorkspace;
    const result = schema.validate(req.body);
    if (result.error) {
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
    }
    next();
};

exports.getWorkspace = (req, res, next) => {
    const schema = Schema.getWorkspace;
    const result = schema.validate(req.params);
    if (result.error) {
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
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
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
    }
    next();
};

exports.deleteWorkspace = (req, res, next) => {
    const schema = Schema.deleteWorkspace;
    const result = schema.validate(req.params);

    if (result.error) {
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
    }
    next();
};
