import fs from 'fs';
import { DEFAULT_AVATAR_IMAGE, DEFAULT_WORKSPACE_LOGO } from '../helpers/constants';


exports.getUserFromMembers = (userId, members) => {
    let currentMember = null;
    members.forEach(item => {
        if (userId.toString() === item.user._id.toString()) {
            return currentMember = item;
        }
    });
    return new Promise(resolve => {
        return resolve(currentMember);
    });
};

exports.deleteImage = (imageUrl) => {
    let result = {
        success: true,
    };
    return new Promise((resolve, reject) => {
        if (imageUrl === '/' + DEFAULT_WORKSPACE_LOGO || imageUrl === '/' + DEFAULT_AVATAR_IMAGE) {
            return resolve(result);
        }
        fs.unlink('./' + imageUrl, (err) => {
            if (err) {
                result = { status: 500, message: err };
                return reject(result);
            }
            return resolve(result);
        });
    });
};
