import * as constansts from './helpers/constants';

const config = {
    port: 3000,
    DB: {
        url: 'mongodb://localhost:27017/alternative_slack',
    },
    JWT_SECRET_KEY: constansts.JWT_SECRET_KEY,
};

module.exports = config;
