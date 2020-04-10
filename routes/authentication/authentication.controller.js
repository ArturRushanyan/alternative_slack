import moment from 'moment';

// Models
import userModel from '../../models/User';
import tokenModel from '../../models/Tokens';

// Error
import Error from '../../helpers/Error';

// Authenticate
import * as authenticateWithJoi from '../../helpers/joiVerifay';

// helpers
import * as hash from '../../helpers/hash';
import * as Token from '../../helpers/generateToken';
import { PASSWORD_RESET_REASON } from '../../helpers/constants';
// import { transporter } from '../../helpers/mailer';

// Services
import tokenService  from '../../services/tokenService';
import * as userService from '../../services/userService';


exports.SignUp = (req, res, next) => {
    let createdUser;
    if(!authenticateWithJoi.Registration(req)) {
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
    }

    userService.findUserByEmail(req.body.email).then(user => {
        if(user) {
            throw {
                status: 409,
                message: 'User already exists'
            }
        }
        return hash.hasingPassword(req.body.password);
    }).then(hashedPassword => {
        let newUser = new userModel({
            email: req.body.email,
            password: hashedPassword,
            fullName: req.body.fullName,
        });
        return userService.createUser(newUser);
    }).then((user) => {
        if(!user) {
            throw {
                status: 500,
                message: 'something went wrong'
            }
        }
        createdUser = user;
        return Token.generateAuthToken(res, user._id)
    }).then(authToken => {
       res.status(200).json({
           success: true,
           access_token: authToken,
           user: createdUser
       });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    })
};

exports.Login = (req, res, next) => {
    let user;
    let authToken;
    if(!authenticateWithJoi.Login(req)) {
        return Error.errorHandler(res, 422, 'couldn\'t pass validation');
    }

    userService.findUserByEmail(req.body.email).then(result => {
        if (!result) {
            throw  {
                status: 404,
                message: 'user doesn\'t exists'
            };
        }
        user = result;
        return hash.comparePassword(req.body.password, user.password);
    }).then((isMatch) => {
        if (!isMatch) {
            throw  {
                status: 403,
                message: 'passwords does not match'
            };
        }
        return Token.generateAuthToken(res, user._id)
    }).then(token => {
        authToken = token;
        let attributes = {
            isLoggedIn: true,
            lastLogin: Date.now(),
        };
        return userService.findUserAndUpdate({ _id: user._id }, attributes);
    }).then(updatedUser => {
        if (!updatedUser) {
            throw {
                status: 500,
                message: 'something went wrong'
            }
        }
        return res.status(200).json({
            success: true,
            access_token: authToken,
            user: updatedUser
        });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    })
};

exports.Logout = (req, res, next) => {
    const user = req.user;
    let attributes = {
        isLoggedIn: false,
    };
    return userService.findUserAndUpdate({ _id: user._id }, attributes)
    .then(() => {
        res.status(200).json({
            success: true,
        });
    }).catch(err => {
        return Error.errorHandler(res, 500, err);
    });
};

exports.resetPassword = (req, res, next) => {
    let emailFromReq = req.body.email;
    let user;
    if (!authenticateWithJoi.resetPassword(req)) {
        return Error.errorHandler(res, 400, 'email is required');
    }
    emailFromReq = emailFromReq.toLowerCase();

    userService.findUserByEmail(emailFromReq).then((result) => {
        if (!result) {
            throw { status: 404, message: 'user doesn\'t exists' }
        }
        user = result;
        return Token.generateResetPasswordToken();
    }).then((tokenInfo) => {
        return tokenService.addTemporaryToken(user.email, tokenInfo, PASSWORD_RESET_REASON);
    }).then((result) => {
        // Sending email but it's now doesn't work!!!!
        // const mailOptions = {
        //     from: `${process.env.ADMIN_EMAIL}`, // sender address
        //     to: `${emailFromReq}`, // list of receivers
        //     subject: 'Token', // Subject line
        //     html: `please enter this token in postman url: <strong>${result.token}</strong>`// plain text body
        // };
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.log('err =>>>>', error);
        //         res.status(400).json({
        //             success: false,
        //         })
        //     } else {
        //         res.status(200).json({
        //             success: true,
        //             info: info
        //         });
        //     }
        //     transporter.close()
        // });
        res.status(200).json({ result });
    }).catch(err => {
        console.log('err= >>>>>>>', err);
        // return Error.errorHandler(res, err.status, err.message);
    });
};

// exports.resetPasswordConfirmation = (req, res, next) => {
//     const { token } = req.params;
//     const { password } = req.body;
//     let userData;
//
//     tokenModel.findOne({
//         token: token,
//         reason:  PASSWORD_RESET_REASON
//     }).then((result) => {
//         if (!result) {
//             return Error.errorHandler(res, 400, 'Invalid token');
//         }
//
//         if (moment(result.expiration, "YYYY-MM-DD HH:mm:ss").isBefore(moment().format("YYYY-MM-DD HH:mm:ss"))) {
//             baseService.findTokenByIdAndDelete(result._id);
//             Error.errorHandler(res, 409, 'Token is expired, please try again');
//         }
//         userData = result;
//         return hash.hasingPassword(password);
//     }).then((newPassword) => {
//         User.findOneAndUpdate({
//             email: userData.email
//         }, {
//             $set: {
//                 password: newPassword
//             }
//         });
//         baseService.findTokenByIdAndDelete(userData._id);
//         return res.status(200).json({ success: true, message: 'password successfully updated' })
//     }).catch(err => {
//         return Error.errorHandler(res, 500, err);
//     })
// };

