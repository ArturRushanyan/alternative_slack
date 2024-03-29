import moment from 'moment';

// Error
import Error from '../../helpers/Error';

// helpers
import * as hash from '../../helpers/hash';
import * as Token from '../../helpers/generateToken';
import * as constants from '../../helpers/constants';
// import { transporter } from '../../helpers/mailer';

// Services
import * as tokenService  from '../../services/tokenService';
import * as userService from '../../services/userService';
import * as userWorkspaceService from '../../services/userWorkspaceService';
import {SOMETHING_WENT_WRONG} from "../../helpers/constants";


exports.SignUp = (req, res, next) => {
    let createdUser;
    let workspaces;

    userService.findUserByEmail(req.body.email).then(user => {
        if(user) {
            throw { status: 409, message: constants.ALREADY_EXISTS('User') };
        }

        return hash.hashingPassword(req.body.password);
    }).then(hashedPassword => {
        let newUser = {
            email: req.body.email,
            password: hashedPassword,
            fullName: req.body.fullName,
        };

        return userService.createUser(newUser);
    }).then((user) => {
        if (!user) {
            throw { status: 500, message: constants.SOMETHING_WENT_WRONG };
        }
        createdUser = user;

        return userWorkspaceService.createUserWorkspace(user._id);
    }).then((userWorkspaces) => {
        if (!userWorkspaces) {
            throw { status: 500, message: SOMETHING_WENT_WRONG };
        }
        workspaces = userWorkspaces;

        return Token.generateAuthToken(createdUser._id);
    }).then(authToken => {
       return res.status(200).json({
           success: true,
           access_token: authToken,
           user: createdUser,
           workspaces,
       });

    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    })
};

exports.Login = (req, res, next) => {
    let user;
    let authToken;

    userService.findUserByEmail(req.body.email).then(result => {
        if (!result) {
            throw  { status: 404, message: constants.NOT_EXISTS('user') };
        }
        user = result;

        return hash.comparePassword(req.body.password, user.password);
    }).then((isMatch) => {
        if (!isMatch) {
            throw  { status: 403, message: constants.INCORRECT_PASSWORD };
        }

        return Token.generateAuthToken(user._id)
    }).then(token => {

        authToken = token;
        let attributes = {
            isLoggedIn: true,
            lastLogin: Date.now(),
        };

        return userService.findUserAndUpdate({ _id: user._id }, attributes);
    }).then(updatedUser => {
        if (!updatedUser.success) {
            throw { status: 500, message: constants.SOMETHING_WENT_WRONG };
        }
        user = updatedUser;

        return userWorkspaceService.getUserWorkspaces(user.userData._id);
    }).then((workspaces) => {
        if (!workspaces) {
            throw { status: 500, message: SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({
            success: true,
            access_token: authToken,
            user,
            workspaces,
        });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    })
};

exports.Logout = (req, res, next) => {
    const { user } = req;
    const attributes = {
        isLoggedIn: false,
    };

    return userService.findUserAndUpdate({ _id: user._id }, attributes)
    .then(result => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true });
    }).catch(err => {
        return Error.errorHandler(res, 500, err);
    });
};

exports.resetPassword = (req, res, next) => {
    let emailFromReq = req.body.email;
    let user;

    emailFromReq = emailFromReq.toLowerCase();

    userService.findUserByEmail(emailFromReq).then((result) => {
        if (!result) {
            throw { status: 404, message: constants.NOT_EXISTS('user') }
        }
        user = result;

        return Token.generateResetPasswordToken();
    }).then((tokenInfo) => {
        return tokenService.addTemporaryToken(user, tokenInfo, constants.PASSWORD_RESET_REASON);
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
        return res.status(200).json({ result });

    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    });
};

exports.resetPasswordConfirmation = (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    let tokenData;

    tokenService.getByTokenAndReason(token, constants.PASSWORD_RESET_REASON).then(token => {
        if (!token.token || !token.user) {
            throw {status: 400, message: constants.INVALID_TOKEN}
        }
        tokenData = token;

        return tokenService.isTokenExpired(token);
    }).then((result) => {
        if (result) {
            throw { status: 409, message: constants.EXPIRED_TOKEN };
        }

        return hash.hashingPassword(password);
    }).then((newPassword) => {
        return userService.findUserAndUpdate({ email: tokenData.user.email }, { password: newPassword });
    }).then((result) => {
        if (!result.success) {
            throw {status: 500, message: result.error};
        }

        return tokenService.findTokenByIdAndDelete(tokenData._id);
    }).then((result) => {
        if (!result.success) {
            throw { status: 500, message: result.error };
        }

        return res.status(200).json({ success: true, message: constants.PASSWORD_UPDATED })
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    })
};

