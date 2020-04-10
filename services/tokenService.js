import tokenModel from '../models/Tokens';
import moment from "moment";
import {PASSWORD_RESET_REASON} from "../helpers/constants";

module.exports.findTokenByIdAndDelete = (id) => {
    return tokenModel.deleteOne({ _id: id });
};

module.exports.isUserHaveToken = (email, reason) => {
    return tokenModel.findOne({ email, reason });
};

exports.addTemporaryToken = (email, tokenInfo, reason) => {
    return tokenModel.findOne({ email, reason }).then((result) => {
        if (result) {
            let attributes = {
                token: tokenInfo.token,
                expiration: moment(tokenInfo.exp).format("YYYY-MM-DD HH:mm:ss"),
            };
            return tokenModel.findOneAndUpdate({ email, reason }, attributes, { new: true});
        }
        let attributes = new tokenModel({
            email,
            token: tokenInfo.token,
            expiration: moment(tokenInfo.exp).format("YYYY-MM-DD HH:mm:ss"),
            reason: reason
        });

        return attributes.save();
    });
};
