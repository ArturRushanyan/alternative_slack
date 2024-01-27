import { ExtractJwt, Strategy } from 'passport-jwt';
import User from '../models/User';
import config from '../config';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET_KEY;


module.exports = passport => {
    passport.use(new Strategy(opts, function(jwt_payload, done) {
        User.findOne({ _id: jwt_payload._id}, function(err, user) {
            if (err) {
                console.log('error in passport  =>>>', err);
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
};
