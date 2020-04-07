import Joi from '@hapi/joi';
import Schema from './verifayingSchema';

exports.Registration = (req) => {
    const schema = Schema.SignUp;
    if (req.body.password !== req.body.confirmPassword) {
        return false;
    }
    const result = Joi.validate(req.body, schema);
    return !!result;
};
