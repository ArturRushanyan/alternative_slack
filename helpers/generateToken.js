import JWT from 'jsonwebtoken';
import Error from '../helpers/Error';
import config from '../config';

exports.generateToken = (res, userId) => {
  return new Promise((resolve, reject) => {
     if (!userId) {
        return reject(Error.errorHandler(res, 400, 'Missing user\'s id'));
     }
     return resolve(JWT.sign({ userId }, config.JWT_KEY, { expiresIn: '1h' }));
  });
};
