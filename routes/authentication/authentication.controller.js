import * as authenticateWithJoi from '../../helpers/joiVerifay';
import Error from '../../helpers/Error';
import User from '../../models/User';
import * as hash from '../../helpers/hash';
import * as Token from '../../helpers/generateToken';

exports.SignUp = (req, res, next) => {
    if(!authenticateWithJoi.Registration(req)) {
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(user) {
            return Error.errorHandler(res, 409, 'User already exists')
        }
        return hash.hasingPassword(req.body.password);
    }).then(hashedPassword => {
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            fullName: req.body.fullName,
            isLoggedIn: true,
        });
        return user.save();
    }).then((user) => {
        Token.generateToken(res, user._id)
            .then(AuthToken => {
               res.status(200).json({
                   success: true,
                   authToken: AuthToken,
                   user: user
               });
            });
    }).catch(err => {
        return Error.errorHandler(res, 500, err);
    })
};

exports.Login = (req, res, next) => {
    if(!authenticateWithJoi.Login(req)) {
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        console.log('user =>>>>', user);
        if (!user) {
            return Error.errorHandler(res, 404, 'user doesn\'t exists');
        }
        Token.generateToken(res, user._id)
            .then(AuthToken => {
                res.status(200).json({
                    success: true,
                    authToken: AuthToken,
                    user: user
                });
            });
    }).catch(err => {
        return Error.errorHandler(res, 500, err);
    })
};
