import userModel from '../models/User';
import {DEFAULT_AVATAR_IMAGE} from "../helpers/constants";

exports.findUserByEmail = (email) => {
    return userModel.findOne({ email });
};

exports.getUser = (query) => {
    return userModel.findOne(query);
};

exports.createUser = (data) => {
    let user = new userModel({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        isLoggedIn: true,
    });

    return user.save();
};

exports.findUserAndUpdate = (query, attributes) => {
    return userModel.findOneAndUpdate(query, attributes, { new: true }).then(result => {
       if (!result) {
           return { success: false }
       }
        return { success: true, userData: result };
    }).catch(err => {
        return { success: false, error: err }
    });
};

exports.updateUser = (data) => {
    const requiredFields = ['fullName', 'email'];
    const changeableFields = [...requiredFields];
    const updatedUser = {};

    return new Promise((resolve, reject) => {
        Object.keys(data).map(key => {
           if (changeableFields.includes(key)) {
                if (requiredFields.includes(key && !data[key])) {
                    const err = { success: false, error: `${key} can not be empty` };
                    return reject(err);
                }
                updatedUser[key] = data[key];
           }
        });
        if (!Object.keys(updatedUser).length) {
            const err = { success: false, status: 400, message: 'Nothing to change'};
            return reject(err);
        }

        return resolve(updatedUser);
    });
};

exports.updateUserAvatar = (user, path) => {
    if (path !== DEFAULT_AVATAR_IMAGE) {
        path = '/' + path;
    }
    return userModel.findOneAndUpdate({ _id: user._id }, { imageUrl: path }, { new: true }).then(result => {
        if (!result) {
            return { success: false };
        }
        return { success: true, userData: result };
    }).catch(err => {
        return { success: false, error: err }
    });
};
