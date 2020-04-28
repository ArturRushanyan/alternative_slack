import Error from '../../helpers/Error';
import { SOMETHING_WENT_WRONG, DEFAULT_AVATAR_IMAGE } from '../../helpers/constants';

import * as userService from '../../services/userService';
import * as utils from '../../helpers/utils';


exports.get = (req, res, next) => {
    const id = req.user._id;

    userService.getUser({ _id: id }).then((user) => {
        return res.status(200).json({ user });
    }).catch(err => {
        return Error.errorHandler(res, 500, err || SOMETHING_WENT_WRONG);
    });
};

exports.update = (req, res, next) => {
    const { user } = req;

    userService.updateUser(req.body).then((updatedUser) => {
        return userService.findUserAndUpdate({ _id: user._id }, updatedUser);
    }).then((result) => {
        if (!result.success || !result) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true, user: result.userData });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    });
};

exports.uploadImage = (req, res, next) => {
    utils.deleteImage(req.user.imageUrl).then((result) => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }
        return userService.updateUserAvatar(req.user, req.file.path);
    }).then((result) => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true, user: result.userData });
    }).catch(err => {
        utils.deleteImage(req.file.path);
        return Error.errorHandler(res, err.status, err.message || err);
    })
};

exports.deleteImage = (req, res, next) => {
    utils.deleteImage(req.user.imageUrl).then((result) => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }
        return userService.updateUserAvatar(req.user, DEFAULT_AVATAR_IMAGE);
    }).then((result) => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true, user: result.userData });
    }).catch(err => {
        utils.deleteImage(req.file.path);
        return Error.errorHandler(res, err.status, err.message || err);
    })
};







