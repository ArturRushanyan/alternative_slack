import JWT from 'jsonwebtoken';
import moment from 'moment';
import { uid } from 'rand-token';
import Error from '../helpers/Error';
import config from '../config';
import * as constants from '../helpers/constants';

exports.generateAuthToken = (res, userId) => {
    return new Promise((resolve, reject) => {
        if (!userId) {
            reject(Error.errorHandler(res, 400, constants.MISSING_USER_ID));
        }
        resolve(JWT.sign({ _id: userId }, config.JWT_SECRET_KEY, { expiresIn: '1h' }));
    });
};

exports.generateResetPasswordToken = (expirationHours = 20, size = 20, unit = 'minutes') => {
    return new Promise((resolve, reject) => {
        try {
            let tokenInfo = {
                token: uid(size),
                exp: moment().add(expirationHours, unit).valueOf(),
            };
            resolve(tokenInfo);
        } catch (err) {
            reject(err);
        }
    });
};
