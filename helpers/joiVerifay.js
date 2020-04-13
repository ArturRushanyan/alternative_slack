import Schema from './verifayingSchema';

exports.Registration = (req) => {
    const schema = Schema.SignUp;
    if (req.body.password !== req.body.confirmPassword) {
        return false;
    }
    const result = schema.validate(req.body);
    if (result.error) {
        return false;
    }
    return true;
};

exports.Login = (req) => {
    const schema = Schema.Login;
    const result = schema.validate(req.body);
    if (result.error) {
        return false;
    }
    return true;
};

exports.resetPassword = (req) => {
  const schema = Schema.resetPassword;
    const result = schema.validate(req.body);
    if (result.error) {
        return false;
    }
    return true;
};

exports.resetPasswordConfirmation = (req) => {
    const schema = Schema.resetPasswordConfirmation;
    const result = schema.validate(req.body);
    if (result.error) {
        return false;
    }
    return true;
};
