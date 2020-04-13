import tokenModel from '../models/Tokens';
import moment from "moment";

exports.findTokenByIdAndDelete = (id) => {
    return tokenModel.findOneAndDelete({ _id: id }).then(result => {
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
            let attributes = {
                token: tokenInfo.token,
                expiration: moment(tokenInfo.exp).format("YYYY-MM-DD HH:mm:ss"),
            };
            return tokenModel.findOneAndUpdate({ user: user._id, reason }, attributes, { new: true});
        }
        let attributes = new tokenModel({
            user: user._id,
            token: tokenInfo.token,
            expiration: moment(tokenInfo.exp).format("YYYY-MM-DD HH:mm:ss"),
            reason: reason
        });

        return attributes.save();
    });
};
