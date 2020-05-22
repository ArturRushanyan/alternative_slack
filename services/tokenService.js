import tokenModel from '../models/Tokens';
import moment from "moment";
import * as constants from "../helpers/constants";

exports.findTokenByIdAndDelete = (tokenId) => {
    return tokenModel.findOneAndDelete({ _id: tokenId }).then(result => {
        if (result) {
            return { success: true }
        }
    }).catch(err => {
        return { success: false, error: err }
    });
};

exports.isUserHaveToken = (email, reason) => {
    return tokenModel.findOne({ email, reason });
};

exports.getByTokenAndReason= (token, reason) => {
    return tokenModel.findOne({ token, reason }).populate('user');
};

exports.addTemporaryToken = (user, tokenInfo, reason) => {
    return tokenModel.findOne({ user: user._id, reason }).then((result) => {
        if (result) {
            const attributes = {
                token: tokenInfo.token,
                expiration: moment(tokenInfo.exp).format("YYYY-MM-DD HH:mm:ss"),
            };
            return tokenModel.findOneAndUpdate({ user: user._id, reason }, attributes, { new: true});
        }
        const attributes = new tokenModel({
            user: user._id,
            token: tokenInfo.token,
            expiration: moment(tokenInfo.exp).format("YYYY-MM-DD HH:mm:ss"),
            reason: reason
        });

        return attributes.save();
    });
};

exports.isTokenExpired = (token) => {
    return !moment(token.expiration, "YYYY-MM-DD HH:mm:ss").isBefore(moment().format("YYYY-MM-DD HH:mm:ss"));
};
